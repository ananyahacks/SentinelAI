const RiskScore = require("../models/risk.model");

const getAllRiskScores = async (req, res) => {
  try {
    const scores = await RiskScore.find({
      companyId: req.user.companyId, 
    }).sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getRiskScoreByUser = async (req, res) => {
  try {
    const score = await RiskScore.findOne({
      companyId: req.user.companyId, // FIXED
      userId: req.params.userId,
    });

    if (!score) {
      return res.status(404).json({
        message: "Risk score not found",
      });
    }

    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllRiskScores,
  getRiskScoreByUser,
};