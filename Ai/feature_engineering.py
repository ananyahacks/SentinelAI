import ipaddress
from collections import defaultdict
from datetime import datetime

import numpy as np
import pandas as pd

from model_loader import CATEGORICAL_COLUMNS, FEATURE_COLUMNS

NIGHT_HOUR_START = 22
NIGHT_HOUR_END = 6
BUSINESS_HOUR_START = 9
BUSINESS_HOUR_END = 18
LONG_SESSION_MINUTES = 240
HIGH_TRANSFER_BYTES = 500_000_000  
HIGH_DB_QUERIES = 200
HIGH_FILE_ACCESS = 100

SENSITIVE_RESOURCES: set[str] = set()


def _parse_dt(value):
    if value in (None, ""):
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def _is_external_ip(ip_str: str) -> int:
    """Heuristic: public (non-private/non-reserved) IP = external."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return int(not (ip.is_private or ip.is_loopback or ip.is_reserved))
    except (ValueError, TypeError):
        return 0


def safe_label_encode(encoder, values: pd.Series) -> np.ndarray:
    known = set(encoder.classes_)
    unknown_code = len(encoder.classes_)  
    out = np.empty(len(values), dtype=np.int64)
    str_values = values.astype(str)
    for i, v in enumerate(str_values):
        if v in known:
            out[i] = encoder.transform([v])[0]
        else:
            out[i] = unknown_code
    return out


def _derive_raw_row(record: dict) -> dict:
    login_dt = _parse_dt(record.get("loginTime"))
    login_hour = login_dt.hour if login_dt else 0
    is_weekend = int(login_dt.weekday() >= 5) if login_dt else 0
    night_login = int(login_dt is not None and (login_hour >= NIGHT_HOUR_START or login_hour < NIGHT_HOUR_END))
    business_hours = int(login_dt is not None and BUSINESS_HOUR_START <= login_hour < BUSINESS_HOUR_END)

    session_duration = float(record.get("sessionDuration") or 0)
    failed_login_count = float(record.get("failedLoginCount") or record.get("failedLogins") or 0)
    data_transfer_amount = float(record.get("dataTransferAmount") or record.get("dataTransferred") or 0)
    files_accessed = float(record.get("filesAccessed") or 0)
    emails_sent = float(record.get("emailsSent") or 0)
    database_queries = float(record.get("databaseQueries") or 0)
    usb_usage = float(record.get("usbUsage") or 0)
    vpn_usage = float(record.get("vpnUsage") or 0)

    resource_accessed = record.get("resourceAccess") or record.get("resourceAccessed") or ""
    sensitive_access = int(resource_accessed in SENSITIVE_RESOURCES)
    external_ip = _is_external_ip(record.get("ipAddress"))

    return {
        "company_id": record.get("companyId"),
        "user_id": record.get("userId") or record.get("employeeName"),
        "login_hour": login_hour,
        "is_weekend": is_weekend,
        "session_duration": session_duration,
        "failed_login_count": failed_login_count,
        "data_transfer_amount": data_transfer_amount,
        "files_accessed": files_accessed,
        "emails_sent": emails_sent,
        "database_queries": database_queries,
        "usb_usage": usb_usage,
        "vpn_usage": vpn_usage,
        "resource_accessed": resource_accessed,
        "country": record.get("country") or "unknown",
        "ip_address": record.get("ipAddress") or "0.0.0.0",
        "night_login": night_login,
        "business_hours": business_hours,
        "sensitive_access": sensitive_access,
        "external_ip": external_ip,
        "high_transfer": int(data_transfer_amount > HIGH_TRANSFER_BYTES),
        "high_db_queries": int(database_queries > HIGH_DB_QUERIES),
        "high_file_access": int(files_accessed > HIGH_FILE_ACCESS),
        "failed_login_flag": int(failed_login_count > 0),
        "long_session": int(session_duration > LONG_SESSION_MINUTES),
        # placeholders filled in by _add_rolling_features()
        "avg_login_hour": np.nan,
        "avg_session": np.nan,
        "avg_transfer": np.nan,
        "avg_files": np.nan,
        "avg_queries": np.nan,
        "login_deviation": np.nan,
        "transfer_deviation": np.nan,
        "session_deviation": np.nan,
        "query_deviation": np.nan,
        "file_deviation": np.nan,
    }


def _add_rolling_features(df: pd.DataFrame, history_lookup=None) -> pd.DataFrame:
    """
    ASSUMPTION: "avg_*" = per-user historical mean, "*_deviation" = current
    value minus that mean. The notebook's original feature pipeline isn't
    available to confirm this.

    `history_lookup(user_id, metric) -> float | None` is an optional
    plug-in point for real historical baselines (e.g. backed by MongoDB
    aggregation over a user's past 30/90 days). If not provided, or if it
    returns None for a user, this falls back to the mean across the
    current batch for that user - a weak proxy, since a single anomalous
    batch will drag its own baseline toward itself.
    """
    metric_pairs = [
        ("login_hour", "avg_login_hour", "login_deviation"),
        ("session_duration", "avg_session", "session_deviation"),
        ("data_transfer_amount", "avg_transfer", "transfer_deviation"),
        ("files_accessed", "avg_files", "file_deviation"),
        ("database_queries", "avg_queries", "query_deviation"),
    ]

    batch_means = df.groupby("user_id")[[m for m, _, _ in metric_pairs]].mean()

    for metric, avg_col, dev_col in metric_pairs:
        avgs = []
        for uid in df["user_id"]:
            baseline = None
            if history_lookup is not None:
                baseline = history_lookup(uid, metric)
            if baseline is None:
                baseline = batch_means.loc[uid, metric]
            avgs.append(baseline)
        df[avg_col] = avgs
        df[dev_col] = df[metric] - df[avg_col]

    return df


def build_feature_dataframe(records: list[dict], history_lookup=None) -> pd.DataFrame:
    """Raw records -> DataFrame with all 34 FEATURE_COLUMNS, unscaled/unencoded."""
    rows = [_derive_raw_row(r) for r in records]
    df = pd.DataFrame(rows)
    df = _add_rolling_features(df, history_lookup=history_lookup)
    return df[FEATURE_COLUMNS]


def encode_and_scale(df: pd.DataFrame, encoders: dict, scaler) -> np.ndarray:
    """Applies label encoding to categorical columns, then the fitted StandardScaler."""
    encoded = df.copy()
    for col in CATEGORICAL_COLUMNS:
        encoded[col] = safe_label_encode(encoders[col], encoded[col])
    encoded = encoded.astype(float)
    return scaler.transform(encoded.values)