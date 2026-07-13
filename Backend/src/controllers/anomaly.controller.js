const ActivityLog = require('../models/activitylogs.model')
const RiskScore = require('../models/risk.model')
const { getRiskScores } = require('../services/gnn_services')

/**
 * Runs anomaly detection over a company's recent activity logs and
 * persists per-employee risk scores (max risk across their events in
 * the window).
 *
 * Body (optional): { sinceDays: number } - defaults to 7 days of logs
 */
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
            // Surface this loudly - scores are not trustworthy until the
            // real label encoders are deployed alongside the model.
            console.warn(
                "[anomaly] GNN service is running with placeholder encoders. " +
                "Risk scores are not meaningful until encoders.pkl is deployed."
            )
        }

        const docs = result.userScores.map(s => ({
            companyId,
            employeeName: s.employeeName,
            riskScore: s.riskScore,
            isAnomaly: s.isAnomaly,
            computedAt: new Date()
        }))

        if (docs.length > 0) {
            await RiskScore.insertMany(docs)
        }

        res.status(201).json({
            message: "Anomaly detection completed",
            encodersArePlaceholder: result.encoders_are_placeholder,
            totalUsersScored: result.userScores.length,
            anomaliesFound: result.userScores.filter(s => s.isAnomaly).length,
            userScores: result.userScores,
            eventScores: result.eventScores
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message || "Anomaly detection failed" })
    }
}

/**
 * Returns the most recent risk score per employee for the company.
 */
async function getLatestRiskScores(req, res) {
    try {
        const companyId = req.user.companyId

        const latest = await RiskScore.aggregate([
            { $match: { companyId } },
            { $sort: { computedAt: -1 } },
            {
                $group: {
                    _id: "$employeeName",
                    riskScore: { $first: "$riskScore" },
                    isAnomaly: { $first: "$isAnomaly" },
                    computedAt: { $first: "$computedAt" }
                }
            },
            { $sort: { riskScore: -1 } }
        ])

        res.status(200).json(
            latest.map(doc => ({
                employeeName: doc._id,
                riskScore: doc.riskScore,
                isAnomaly: doc.isAnomaly,
                computedAt: doc.computedAt
            }))
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message || "Failed to fetch risk scores" })
    }
}

module.exports = { runAnomalyDetection, getLatestRiskScores }