const axios = require('axios')

// CUSTOMIZE: set GNN_SERVICE_URL in your .env, e.g. http://localhost:8000
const GNN_SERVICE_URL = process.env.GNN_SERVICE_URL || 'http://localhost:8000'

/**
 * Sends a batch of RAW activity-log events to the Python GNN service.
 * These must be per-event (one per login/session) - the model was
 * trained at that grain, not on pre-aggregated per-user stats.
 *
 * NOTE: several fields the model needs (country, filesAccessed,
 * emailsSent, databaseQueries, usbUsage, vpnUsage) are not currently
 * collected by activity.controller.js's CSV upload. They're included
 * here as optional so the service can still run in "best effort" mode
 * on your existing schema, but scores will be more accurate once these
 * are actually captured - see activitylogs.model.updated.js and
 * activity.controller.updated.js for the schema/upload changes needed.
 *
 * @param {string} companyId
 * @param {Array<Object>} logs - raw ActivityLog documents (plain objects)
 * @returns {Promise<{encoders_are_placeholder: boolean, eventScores: Array, userScores: Array}>}
 */
async function getRiskScores(companyId, logs) {
    if (!logs || logs.length === 0) {
        return { encoders_are_placeholder: false, eventScores: [], userScores: [] }
    }

    const events = logs.map(log => ({
        companyId: String(companyId),
        userId: log.userId ? String(log.userId) : null,
        employeeName: log.employeeName,
        loginTime: log.loginTime ? new Date(log.loginTime).toISOString() : null,
        logoutTime: log.logoutTime ? new Date(log.logoutTime).toISOString() : null,
        ipAddress: log.ipAddress,
        country: log.country || null,
        sessionDuration: log.sessionDuration != null ? Number(log.sessionDuration) : null,
        failedLogins: log.failedLogins != null ? Number(log.failedLogins) : null,
        dataTransferred: log.dataTransferred != null ? Number(log.dataTransferred) : null,
        resourceAccess: log.resourceAccess,
        filesAccessed: log.filesAccessed != null ? Number(log.filesAccessed) : null,
        emailsSent: log.emailsSent != null ? Number(log.emailsSent) : null,
        databaseQueries: log.databaseQueries != null ? Number(log.databaseQueries) : null,
        usbUsage: log.usbUsage != null ? Number(log.usbUsage) : null,
        vpnUsage: log.vpnUsage != null ? Number(log.vpnUsage) : null
    }))

    try {
        const response = await axios.post(
            `${GNN_SERVICE_URL}/predict`,
            { companyId: String(companyId), events },
            { timeout: 30000 }
        )
        return response.data
    } catch (err) {
        if (err.response) {
            throw new Error(`GNN service error (${err.response.status}): ${JSON.stringify(err.response.data)}`)
        }
        if (err.code === 'ECONNREFUSED') {
            throw new Error('GNN service is unreachable. Is it running?')
        }
        throw new Error(`GNN service request failed: ${err.message}`)
    }
}

module.exports = { getRiskScores }