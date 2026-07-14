const express = require('express')
const auth = require('../middleware/auth.middleware')
const { isAdmin, allowRoles } = require('../middleware/role.middleware')
const { runAnomalyDetection, getLatestRiskScores } = require('../controllers/anomaly.controller')
const router = express.Router()

router.post('/run', auth, isAdmin, runAnomalyDetection)
router.get('/scores', auth, allowRoles('ADMIN', 'SECURITY_ANALYST'), getLatestRiskScores)

module.exports = router