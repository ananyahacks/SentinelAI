const express = require('express')
const auth = require('../middleware/auth.middleware')
const {isAdmin} = require('../middleware/role.middleware')
const { runAnomalyDetection, getLatestRiskScores } = require('../controllers/anomaly.controller')

const router = express.Router()

router.post('/run', auth, isAdmin, runAnomalyDetection)
router.get('/scores', auth, isAdmin, getLatestRiskScores)

module.exports = router