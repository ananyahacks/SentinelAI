# SentinelAI

AI-Powered User and Entity Behavior Analytics (UEBA) Platform for Insider Threat Detection

## Overview

SentinelAI is an AI-driven Software-as-a-Service (SaaS) platform designed to detect insider threats by learning user behavior and identifying anomalous activities using unsupervised machine learning.

The system combines behavioral profiling, feature engineering, anomaly detection, risk scoring, and dashboard visualization to help organizations identify suspicious user activities before they become security incidents.

---

## Features

- User behavior analytics (UEBA)
- Behavioral baseline creation
- Feature engineering pipeline
- Isolation Forest anomaly detection
- Rule-based baseline comparison
- Risk scoring
- Administrator dashboard
- Multi-tenant SaaS architecture
- PostgreSQL database
- REST API backend

---

## Technology Stack

### Frontend

- React.js
- HTML5
- Tailwind CSS
- JavaScript

### Backend

- Python
- Flask / FastAPI

### Database

- PostgreSQL

### Machine Learning

- Scikit-learn
- Isolation Forest

### Data Processing

- Pandas
- NumPy

### Visualization

- Matplotlib
- Seaborn

---

## Project Workflow

```
Company Registration
        ↓
Administrator Login
        ↓
Employee Log Upload
        ↓
PostgreSQL Storage
        ↓
Data Cleaning
        ↓
Feature Engineering
        ↓
Behavioral Baseline Creation
        ↓
Isolation Forest
        ↓
Risk Score Generation
        ↓
Alert Generation
        ↓
Dashboard Visualization
```

---

## Repository Structure

```
raw/
notebooks/
frontend/
backend/
database/
screenshots/
docs/
```

---

## Dataset

The project uses a synthetic enterprise user activity dataset generated using the Faker library.

The dataset simulates:

- Employee login activities
- VPN usage
- Failed login attempts
- File access behavior
- Database queries
- Data transfer volume
- Insider threat scenarios

---

## Machine Learning Pipeline

- Data Understanding
- Data Cleaning
- Feature Engineering
- Behavioral Baseline Creation
- Isolation Forest
- Model Evaluation

---

## Results

Example evaluation metrics:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

---

## Future Scope

- Autoencoders
- Graph Neural Networks
- Explainable AI
- Real-time log streaming
- SIEM integration
- SOAR automation
- Multi-model ensemble detection

---

## Authors

Ananya Chakraborty
Rushati Ray
