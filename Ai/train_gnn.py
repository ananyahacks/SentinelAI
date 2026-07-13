import os
import joblib
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from sklearn.preprocessing import LabelEncoder, StandardScaler

from model_def import GraphSAGE
from graph_builder import build_graph
from feature_engineering import build_feature_dataframe, encode_and_scale
from model_loader import CATEGORICAL_COLUMNS, FEATURE_COLUMNS

# Device configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {DEVICE}")

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.normpath(os.path.join(BASE_DIR, "../datasets/raw/saas_features_v2.csv"))
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.normpath(os.path.join(MODEL_DIR, "graphsage_model.pth"))
SCALER_PATH = os.path.normpath(os.path.join(MODEL_DIR, "graphsage_scaler.pkl"))
ENCODERS_PATH = os.path.normpath(os.path.join(MODEL_DIR, "encoders.pkl"))

os.makedirs(MODEL_DIR, exist_ok=True)

def train():
    print(f"Loading dataset from: {DATASET_PATH}")
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
        
    df_raw = pd.read_csv(DATASET_PATH)
    print(f"Dataset loaded. Shape: {df_raw.shape}")
    
    # Rename columns to match the API camelCase expectation in build_feature_dataframe
    rename_dict = {
        "company_id": "companyId",
        "user_id": "userId",
        "login_time": "loginTime",
        "session_duration": "sessionDuration",
        "failed_login_count": "failedLoginCount",
        "data_transfer_amount": "dataTransferAmount",
        "files_accessed": "filesAccessed",
        "emails_sent": "emailsSent",
        "database_queries": "databaseQueries",
        "usb_usage": "usbUsage",
        "vpn_usage": "vpnUsage",
        "resource_accessed": "resourceAccess",
        "country": "country",
        "ip_address": "ipAddress"
    }
    
    df_renamed = df_raw.rename(columns=rename_dict)
    records = df_renamed.to_dict("records")
    
    print("Extracting features using feature engineering pipeline...")
    feature_df = build_feature_dataframe(records)
    print(f"Features extracted. Shape: {feature_df.shape}")
    
    # Fit LabelEncoders for categorical columns
    print("Fitting encoders...")
    encoders_dict = {}
    encoded_df = feature_df.copy()
    for col in CATEGORICAL_COLUMNS:
        le = LabelEncoder()
        # Add '__unknown__' class to handle unseen values at prediction time
        unique_vals = list(encoded_df[col].astype(str).unique())
        if '__unknown__' not in unique_vals:
            unique_vals.append('__unknown__')
        le.fit(unique_vals)
        encoders_dict[col] = le
        
        # Apply encoding
        encoded_df[col] = le.transform(encoded_df[col].astype(str))
        
    # Fit StandardScaler
    print("Fitting scaler...")
    scaler = StandardScaler()
    encoded_values = encoded_df.astype(float).values
    scaler.fit(encoded_values)
    X_scaled = scaler.transform(encoded_values)
    
    # Build graph
    print("Building PyG graph...")
    graph = build_graph(X_scaled)
    graph = graph.to(DEVICE)
    print(f"Graph built with {graph.num_nodes} nodes and {graph.num_edges} edges.")
    
    # Train GNN Model
    print("Initializing GraphSAGE model...")
    model = GraphSAGE(input_dim=len(FEATURE_COLUMNS))
    model = model.to(DEVICE)
    
    y = torch.tensor(df_raw["risk_label"].values, dtype=torch.long).to(DEVICE)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=5e-4)
    criterion = nn.CrossEntropyLoss()
    
    print("Starting training...")
    model.train()
    epochs = 100
    for epoch in range(epochs):
        optimizer.zero_grad()
        out = model(graph.x, graph.edge_index)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 10 == 0:
            preds = out.argmax(dim=1)
            acc = (preds == y).sum().item() / len(y)
            print(f"Epoch {epoch + 1:3d}/{epochs}, Loss: {loss.item():.4f}, Accuracy: {acc:.4f}")
            
    # Save artifacts
    print(f"Saving model to {MODEL_PATH}...")
    torch.save(model.state_dict(), MODEL_PATH)
    
    print(f"Saving scaler to {SCALER_PATH}...")
    joblib.dump(scaler, SCALER_PATH)
    
    print(f"Saving encoders to {ENCODERS_PATH}...")
    joblib.dump(encoders_dict, ENCODERS_PATH)
    
    print("Training and artifact generation complete!")

if __name__ == "__main__":
    train()
