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
        return joblib.load(ENCODERS_PATH), False
 
    logger.warning(
        "encoders.pkl not found at %s. Falling back to empty placeholder "
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
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model weights not found at {MODEL_PATH}. Copy graphsage_model.pth "
            f"from your notebook's SAVE_PATH into {MODEL_DIR}/"
        )
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(
            f"Scaler not found at {SCALER_PATH}. Copy graphsage_scaler.pkl "
            f"from your notebook's SAVE_PATH into {MODEL_DIR}/"
        )
 
    model = GraphSAGE(input_dim=len(FEATURE_COLUMNS))
    state_dict = torch.load(MODEL_PATH,map_location=DEVICE,weights_only=False)
    model.load_state_dict(state_dict)
    model.to(DEVICE)
    model.eval()
 
    scaler = joblib.load(SCALER_PATH)
    encoders, is_placeholder = _load_encoders()
 
    return LoadedArtifacts(model=model, scaler=scaler, encoders=encoders, encoders_are_placeholder=is_placeholder)
 



