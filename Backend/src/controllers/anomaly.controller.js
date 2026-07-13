const ActivityLog = require('../models/activitylogs.model')
const userModel = require('../models/user.model')
const RiskScore = require('../models/risk.model')
const { getRiskScores } = require('../services/gnn_services')
const RISK_LEVEL_THRESHOLDS = { low: 0.3, medium: 0.6, high: 0.85 } 

function riskLevelOf(score) {
    if (score >= RISK_LEVEL_THRESHOLDS.high) return "CRITICAL"
    if (score >= RISK_LEVEL_THRESHOLDS.medium) return "HIGH"
    if (score >= RISK_LEVEL_THRESHOLDS.low) return "MEDIUM"
    return "LOW"
}


async function resolveUserIds(companyId, logs) {
    const map = new Map()
    for (const log of logs) {
        if (log.employeeName && log.userId && !map.has(log.employeeName)) {
            map.set(log.employeeName, log.userId)
        }
    }

    const unresolved = [...new Set(logs.map(l => l.employeeName).filter(name => name && !map.has(name)))]
    if (unresolved.length > 0) {
        const users = await userModel.find({
            company: companyId,
            username: { $in: unresolved }
        }).select('_id username').lean()

        for (const u of users) {
            map.set(u.username, u._id)
        }
    }

    return map
}

async function runAnomalyDetection(req, res) {
    try {
        const companyId = req.user.companyId
        const sinceDays = Number(req.body?.sinceDays) || 7

        const since = new Date()
        since.setDate(since.getDate() - sinceDays)

        const logs = await ActivityLog.find({
            companyId,
            createdAt: { $gte: since }
        }).lean()

        if (logs.length === 0) {
            return res.status(200).json({ message: "No activity logs found for the given window", userScores: [] })
        }

        const result = await getRiskScores(companyId, logs)

        if (result.encoders_are_placeholder) {
            console.warn(
                "[anomaly] GNN service is running with placeholder encoders. " +
                "Risk scores are not meaningful until encoders.pkl is deployed."
            )
        }

        const userIdMap = await resolveUserIds(companyId, logs)

        const docs = []
        const skipped = []
        for (const s of result.userScores) {
            const userId = userIdMap.get(s.employeeName)
            if (!userId) {
                skipped.push(s.employeeName)
                continue
            }
            docs.push({
                companyId,
                userId,
                employeeName: s.employeeName,
                anomalyScore: s.riskScore,
                riskScore: s.riskScore,
                riskLevel: riskLevelOf(s.riskScore),
                prediction: s.isAnomaly ? "ANOMALY" : "NORMAL",
                analyzedAt: new Date()
            })
        }

        if (docs.length > 0) {
            await RiskScore.insertMany(docs)
        }

        res.status(201).json({
            message: "Anomaly detection completed",
            encodersArePlaceholder: result.encoders_are_placeholder,
            totalUsersScored: result.userScores.length,
            persistedCount: docs.length,
            skippedNoUserId: skipped, // employees we couldn't match to a User record
            anomaliesFound: result.userScores.filter(s => s.isAnomaly).length,
            userScores: result.userScores,
            eventScores: result.eventScores
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message || "Anomaly detection failed" })
    }
}

async function getLatestRiskScores(req, res) {
    try {
        const companyId = req.user.companyId

        const latest = await RiskScore.aggregate([
            { $match: { companyId } },
            { $sort: { analyzedAt: -1 } },
            {
                $group: {
                    _id: "$employeeName",
                    riskScore: { $first: "$riskScore" },
                    riskLevel: { $first: "$riskLevel" },
                    prediction: { $first: "$prediction" },
                    analyzedAt: { $first: "$analyzedAt" }
                }
            },
            { $sort: { riskScore: -1 } }
        ])

        res.status(200).json(
            latest.map(doc => ({
                employeeName: doc._id,
                riskScore: doc.riskScore,
                riskLevel: doc.riskLevel,
                isAnomaly: doc.prediction === "ANOMALY",
                analyzedAt: doc.analyzedAt
            }))
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message || "Failed to fetch risk scores" })
    }
}

module.exports = { runAnomalyDetection, getLatestRiskScores }