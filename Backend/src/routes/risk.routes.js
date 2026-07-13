const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {isAdmin, isSecurityAnalyst} = require("../middleware/role.middleware");
const {getAllRiskScores,getRiskScoreByUser} = require("../controllers/risk.controller");


router.get("/",authMiddleware,isSecurityAnalyst,getAllRiskScores);
router.get("/:userId",authMiddleware,isSecurityAnalyst,getRiskScoreByUser);

module.exports = router;