const mongoose = require('mongoose')
const activityLogSchema = new mongoose.Schema({

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    employeeName: {
        type: String,
        required: true
    },

    loginTime: Date,
    logoutTime: Date,
    ipAddress: String,
    country: String,
    filesAccessed: Number,
    emailsSent: Number,
    databaseQueries: Number,
    usbUsage: Number,
    vpnUsage: Number,
    sessionDuration: Number,
    failedLogins: Number,
    dataTransferred: Number,
    resourceAccess: String
}, { timestamps: true });

const activitylog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = activitylog