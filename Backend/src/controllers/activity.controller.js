const fs = require('fs');
const csv = require('csv-parser')
const ActivityLog = require('../models/activitylogs.model')

const uploadLogs = async (req, res) => {
    try {
        const results = [];

        fs.createReadStream(req.file.path).pipe(csv())
            .on("data", (data) => {
                results.push({
                    companyId: req.user.companyId,
                    userId: data.userId || undefined,
                    employeeName: data.employeeName,
                    loginTime: data.loginTime,
                    logoutTime: data.logoutTime,
                    ipAddress: data.ipAddress,
                    country: data.country,
                    filesAccessed: data.filesAccessed,
                    emailsSent: data.emailsSent,
                    databaseQueries: data.databaseQueries,
                    usbUsage: data.usbUsage,
                    vpnUsage: data.vpnUsage,
                    sessionDuration: data.sessionDuration,
                    failedLogins: data.failedLogins,
                    dataTransferred: data.dataTransferred,
                    resourceAccess: data.resourceAccess
                });
            })
            .on("end", async () => {await ActivityLog.insertMany(results);
                res.status(201).json({ message: "Activity Logs Uploaded Successfully", totalRecords: results.length });
            })
            .on("error", (err) => {
                res.status(500).json({ message: `CSV parsing failed: ${err.message}` });
            });

    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find({
            companyId: req.user.companyId
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { uploadLogs, getLogs };