import logging
import os
import joblib
import torch
from sklearn.preprocessing import LabelEncoder
 
from model_def import GraphSAGE

 
logger = logging.getLogger("gnn-service")
 
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "graphsage_model.pth")
SCALER_PATH = os.path.join(MODEL_DIR, "graphsage_scaler.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")
 

FEATURE_COLUMNS = [
    "company_id",
    "user_id",
    "login_hour",
    "is_weekend",
    "session_duration",
    "failed_login_count",
    "data_transfer_amount",
    "files_accessed",
    "emails_sent",
    "database_queries",
    "usb_usage",
    "vpn_usage",
    "resource_accessed",
    "country",
    "ip_address",
    "night_login",
    "business_hours",
    "sensitive_access",
    "external_ip",
    "high_transfer",
    "high_db_queries",
    "high_file_access",
    "failed_login_flag",
    "long_session",
    "avg_login_hour",
    "avg_session",
    "avg_transfer",
    "avg_files",
    "avg_queries",
    "login_deviation",
    "transfer_deviation",
    "session_deviation",
    "query_deviation",
    "file_deviation",
]
 
CATEGORICAL_COLUMNS = ["company_id", "user_id", "country", "resource_accessed", "ip_address"]
 
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
 
 
class LoadedArtifacts:
    def __init__(self, model, scaler, encoders, encoders_are_placeholder: bool):
        self.model = model
        self.scaler = scaler
        self.encoders = encoders
        self.encoders_are_placeholder = encoders_are_placeholder
 
 
def _load_encoders():
    if os.path.exists(ENCODERS_PATH):
        try:
            return joblib.load(ENCODERS_PATH), False
        except Exception as exc:
            logger.warning(
                "Failed to load encoders from %s (%s). Falling back to empty placeholder encoders.",
                ENCODERS_PATH,
                exc,
            )
 
    logger.warning(
        "encoders.pkl not found at %s (or failed to load). Falling back to empty placeholder "
        "encoders - predictions will NOT match the trained model until you "
        "save real encoders from the notebook.",
        ENCODERS_PATH,
    )
    placeholder = {col: LabelEncoder() for col in CATEGORICAL_COLUMNS}
    
    for enc in placeholder.values():
        enc.fit(["__unknown__"])
    return placeholder, True
 
print("MODEL_PATH:", MODEL_PATH)
print("Exists:", os.path.exists(MODEL_PATH))
print("Is file:", os.path.isfile(MODEL_PATH))
print("Is directory:", os.path.isdir(MODEL_PATH))
 
def load_artifacts() -> LoadedArtifacts:
    model = GraphSAGE(input_dim=len(FEATURE_COLUMNS))
    model_loaded = False
    
    if os.path.exists(MODEL_PATH):
        try:
            state_dict = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
            model.load_state_dict(state_dict)
            model_loaded = True
            logger.info("Loaded model weights from %s", MODEL_PATH)
        except Exception as exc:
            logger.warning(
                "Failed to load model weights from %s (%s). Falling back to untrained model.",
                MODEL_PATH,
                exc,
            )
    else:
        logger.warning("Model weights not found at %s. Using untrained model.", MODEL_PATH)
        
    model.to(DEVICE)
    model.eval()
 
    scaler = None
    if os.path.exists(SCALER_PATH):
        try:
            scaler = joblib.load(SCALER_PATH)
            logger.info("Loaded scaler from %s", SCALER_PATH)
        except Exception as exc:
            logger.warning(
                "Failed to load scaler from %s (%s). Falling back to default scaler.",
                SCALER_PATH,
                exc,
            )
    else:
        logger.warning("Scaler not found at %s. Using default scaler.", SCALER_PATH)
            
    if scaler is None:
        import numpy as np
        from sklearn.preprocessing import StandardScaler
        scaler = StandardScaler()
        # Fit on dummy data of the correct input dimension so transform() doesn't fail
        scaler.fit(np.zeros((1, len(FEATURE_COLUMNS))))
        
    encoders, is_placeholder = _load_encoders()
 
    return LoadedArtifacts(model=model, scaler=scaler, encoders=encoders, encoders_are_placeholder=is_placeholder or not model_loaded)
 



