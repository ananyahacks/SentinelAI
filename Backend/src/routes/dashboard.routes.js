const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
    isAdmin,
    isSecurityAnalyst
} = require("../middleware/role.middleware");

const {
    // Admin Dashboard
    getAdminSummary,
    getAdminRecentActivities,
    getAdminActivityTrend,
    getAdminRiskDistribution,
    getAdminUserStatistics,

    // Security Analyst Dashboard
    getAnalystSummary,
    getRecentAlerts,
    getHighRiskUsers,
    getAnomalyTrend,
    getRiskScores

} = require("../controllers/dashboard.controller");


// =========================================
// ADMIN DASHBOARD ROUTES
// =========================================

// Dashboard Summary
router.get(
    "/admin/summary",
    authMiddleware,
    isAdmin,
    getAdminSummary
);

// Recent Activities
router.get(
    "/admin/recent-activities",
    authMiddleware,
    isAdmin,
    getAdminRecentActivities
);

// Activity Trend
router.get(
    "/admin/activity-trend",
    authMiddleware,
    isAdmin,
    getAdminActivityTrend
);

// Risk Distribution
router.get(
    "/admin/risk-distribution",
    authMiddleware,
    isAdmin,
    getAdminRiskDistribution
);

// User Statistics
router.get(
    "/admin/user-statistics",
    authMiddleware,
    isAdmin,
    getAdminUserStatistics
);


// =========================================
// SECURITY ANALYST DASHBOARD ROUTES
// =========================================

// Dashboard Summary
router.get(
    "/analyst/summary",
    authMiddleware,
    isSecurityAnalyst,
    getAnalystSummary
);

// Recent Alerts
router.get(
    "/analyst/recent-alerts",
    authMiddleware,
    isSecurityAnalyst,
    getRecentAlerts
);

// High Risk Users
router.get(
    "/analyst/high-risk-users",
    authMiddleware,
    isSecurityAnalyst,
    getHighRiskUsers
);

// Anomaly Trend
router.get(
    "/analyst/anomaly-trend",
    authMiddleware,
    isSecurityAnalyst,
    getAnomalyTrend
);

// Risk Scores
router.get(
    "/analyst/risk-scores",
    authMiddleware,
    isSecurityAnalyst,
    getRiskScores
);

module.exports = router;