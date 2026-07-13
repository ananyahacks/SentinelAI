const User = require("../models/user.model");
const ActivityLog = require("../models/activitylogs.model");
const RiskScore = require("../models/risk.model");

const getAdminSummary = async (req, res) => {
    try {

        const companyId = req.user.companyid;

        const totalUsers = await User.countDocuments({
            companyid: companyId
        });

        const totalLogs = await ActivityLog.countDocuments({
            companyId
        });

        const totalAnomalies = await RiskScore.countDocuments({
            companyId
        });

        const highRiskUsers = await RiskScore.countDocuments({
            companyId,
            riskLevel: { $in: ["HIGH", "CRITICAL"] }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeUsersToday = await ActivityLog.distinct(
            "userId",
            {
                companyId,
                createdAt: { $gte: today }
            }
        );

        res.status(200).json({
            totalUsers,
            totalLogs,
            totalAnomalies,
            highRiskUsers,
            activeUsersToday: activeUsersToday.length
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Recent Activities
const getAdminRecentActivities = async (req, res) => {

    try {

        const logs = await ActivityLog.find({
            companyId: req.user.companyid
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json(logs);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const getAdminActivityTrend = async (req, res) => {

    try {

        const trend = await ActivityLog.aggregate([

            {
                $match: {
                    companyId: req.user.companyid
                }
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    totalActivities: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        res.status(200).json(trend);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const getAdminRiskDistribution = async (req, res) => {

    try {

        const distribution = await RiskScore.aggregate([

            {
                $match: {
                    companyId: req.user.companyid
                }
            },

            {
                $group: {
                    _id: "$riskLevel",
                    count: {
                        $sum: 1
                    }
                }
            }

        ]);

        res.status(200).json(distribution);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

const getAdminUserStatistics = async (req, res) => {

    try {

        const users = await User.find({
            companyid: req.user.companyid
        })
            .select("employeeName role status");

        res.status(200).json(users);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};



const getAnalystSummary = async (req, res) => {

    try {

        const companyId = req.user.companyid;

        const totalAnomalies = await RiskScore.countDocuments({
            companyId
        });

        const criticalAlerts = await RiskScore.countDocuments({
            companyId,
            riskLevel: "CRITICAL"
        });

        const highRiskUsers = await RiskScore.countDocuments({
            companyId,
            riskLevel: {
                $in: ["HIGH", "CRITICAL"]
            }
        });

        res.status(200).json({
            totalAnomalies,
            criticalAlerts,
            highRiskUsers
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const getRecentAlerts = async (req, res) => {

    try {

        const alerts = await RiskScore.find({
            companyId: req.user.companyid
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json(alerts);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const getHighRiskUsers = async (req, res) => {

    try {

        const users = await RiskScore.find({
            companyId: req.user.companyid,
            riskLevel: {
                $in: ["HIGH", "CRITICAL"]
            }
        });

        res.status(200).json(users);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};



const getAnomalyTrend = async (req, res) => {

    try {

        const trend = await RiskScore.aggregate([

            {
                $match: {
                    companyId: req.user.companyid
                }
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    anomalies: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        res.status(200).json(trend);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const getRiskScores = async (req, res) => {

    try {

        const scores = await RiskScore.find({
            companyId: req.user.companyid
        });

        res.status(200).json(scores);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


module.exports = {
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

};