"""
main.py

FastAPI microservice wrapping the trained GraphSAGE model.

Run locally:
    pip install -r requirements.txt
    # place graphsage_model.pth, graphsage_scaler.pkl, (and ideally
    # encoders.pkl - see model_loader.py) inside ./model/
    uvicorn main:app --host 0.0.0.0 --port 8000

POST /predict takes a batch of RAW per-event activity records (one per
login/session - the same grain the model was trained on, not
pre-aggregated per user) and returns:
    - a risk score + anomaly flag per individual event
    - a risk score + anomaly flag per employee, aggregated as the MAX
      risk across their events in this batch (a single anomalous session
      should flag the employee, not get averaged away)
"""

import logging
from collections import defaultdict
from typing import Any, Optional

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from feature_engineering import build_feature_dataframe, encode_and_scale
from graph_builder import build_graph
from model_loader import load_artifacts

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gnn-service")

app = FastAPI(title="Sentinel AI - GraphSAGE Anomaly Detection Service")

# ASSUMPTION: pick based on your precision/recall trade-off from the
# notebook's ROC/PR curves (best_auc run). 0.5 is the naive softmax
# decision boundary; tune this against your validation results instead.
ANOMALY_THRESHOLD = 0.5

_artifacts = None


class ActivityEvent(BaseModel):
    companyId: str
    userId: Optional[str] = None
    employeeName: str
    loginTime: Optional[str] = None
    logoutTime: Optional[str] = None
    ipAddress: Optional[str] = None
    country: Optional[str] = None
    sessionDuration: Optional[float] = None
    failedLogins: Optional[int] = None
    dataTransferred: Optional[float] = None
    resourceAccess: Optional[str] = None
    filesAccessed: Optional[float] = None
    emailsSent: Optional[float] = None
    databaseQueries: Optional[float] = None
    usbUsage: Optional[float] = None
    vpnUsage: Optional[float] = None


class PredictRequest(BaseModel):
    companyId: str
    events: list[ActivityEvent]


class EventRiskScore(BaseModel):
    employeeName: str
    loginTime: Optional[str] = None
    riskScore: float
    isAnomaly: bool


class UserRiskScore(BaseModel):
    employeeName: str
    riskScore: float
    isAnomaly: bool
    eventCount: int


class PredictResponse(BaseModel):
    companyId: str
    encoders_are_placeholder: bool
    eventScores: list[EventRiskScore]
    userScores: list[UserRiskScore]


@app.on_event("startup")
def _startup():
    global _artifacts
    try:
        _artifacts = load_artifacts()
        logger.info(
            "Model, scaler, encoders loaded. encoders_are_placeholder=%s",
            _artifacts.encoders_are_placeholder,
        )
    except Exception as exc:
        logger.exception("Failed to load model artifacts: %s", exc)
        raise


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": _artifacts is not None,
        "encoders_are_placeholder": _artifacts.encoders_are_placeholder if _artifacts else None,
    }


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if _artifacts is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    if not payload.events:
        return PredictResponse(
            companyId=payload.companyId,
            encoders_are_placeholder=_artifacts.encoders_are_placeholder,
            eventScores=[],
            userScores=[],
        )

    records: list[dict[str, Any]] = [e.model_dump() for e in payload.events]

    try:
        feature_df = build_feature_dataframe(records)
        X_scaled = encode_and_scale(feature_df, _artifacts.encoders, _artifacts.scaler)
        graph = build_graph(X_scaled)
    except Exception as exc:
        logger.exception("Feature/graph construction failed")
        raise HTTPException(status_code=400, detail=f"Feature/graph construction failed: {exc}")

    try:
        with torch.no_grad():
            logits = _artifacts.model(graph.x, graph.edge_index)
            probabilities = torch.softmax(logits, dim=1)
            risk_scores = probabilities[:, 1].cpu().numpy().tolist()  # P(Threat)
    except Exception as exc:
        logger.exception("Inference failed")
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}")

    event_scores = [
        EventRiskScore(
            employeeName=rec["employeeName"],
            loginTime=rec.get("loginTime"),
            riskScore=round(float(score), 4),
            isAnomaly=float(score) >= ANOMALY_THRESHOLD,
        )
        for rec, score in zip(records, risk_scores)
    ]

    # Aggregate to one score per employee: worst-case (max) event risk in the batch.
    by_employee: dict[str, list[float]] = defaultdict(list)
    for rec, score in zip(records, risk_scores):
        by_employee[rec["employeeName"]].append(float(score))

    user_scores = [
        UserRiskScore(
            employeeName=name,
            riskScore=round(max(scores), 4),
            isAnomaly=max(scores) >= ANOMALY_THRESHOLD,
            eventCount=len(scores),
        )
        for name, scores in by_employee.items()
    ]
    user_scores.sort(key=lambda s: s.riskScore, reverse=True)

    return PredictResponse(
        companyId=payload.companyId,
        encoders_are_placeholder=_artifacts.encoders_are_placeholder,
        eventScores=event_scores,
        userScores=user_scores,
    )