const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {isAdmin,isSecurityAnalyst} = require("../middleware/role.middleware");

const {
    getAdminSummary,
    getAdminRecentActivities,
    getAdminActivityTrend,
    getAdminRiskDistribution,
    getAdminUserStatistics,

    getAnalystSummary,
    getRecentAlerts,
    getHighRiskUsers,
    getAnomalyTrend,
    getRiskScores

} = require("../controllers/dashboard.controller");


router.get("/admin/summary",authMiddleware,isAdmin,getAdminSummary);
router.get("/admin/recent-activities",authMiddleware,isAdmin,getAdminRecentActivities);
router.get("/admin/activity-trend",authMiddleware,isAdmin,getAdminActivityTrend);
router.get("/admin/risk-distribution",authMiddleware,isAdmin,getAdminRiskDistribution);
router.get("/admin/user-statistics",authMiddleware,isAdmin,getAdminUserStatistics);


router.get("/analyst/summary",authMiddleware,isSecurityAnalyst,getAnalystSummary);
router.get("/analyst/recent-alerts",authMiddleware,isSecurityAnalyst,getRecentAlerts);
router.get( "/analyst/high-risk-users",authMiddleware,isSecurityAnalyst,getHighRiskUsers);
router.get("/analyst/anomaly-trend",authMiddleware,isSecurityAnalyst,getAnomalyTrend);
router.get("/analyst/risk-scores",authMiddleware,isSecurityAnalyst,getRiskScores);

module.exports = router;