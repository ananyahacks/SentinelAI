const mongoose = require("mongoose");
const riskScoreSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    anomalyScore: {
      type: Number,
      default: 0,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    prediction: {
      type: String,
      enum: ["NORMAL", "ANOMALY"],
      default: "NORMAL",
    },

    remarks: {
      type: String,
      default: "",
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RiskScore", riskScoreSchema);