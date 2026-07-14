const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { isAdmin, isSecurityAnalyst, allowRoles } = require("../middleware/role.middleware");
const { getAllRiskScores, getRiskScoreByUser } = require("../controllers/risk.controller");


router.get("/", authMiddleware, allowRoles("ADMIN", "SECURITY_ANALYST"), getAllRiskScores);
router.get("/:userId", authMiddleware, allowRoles("ADMIN", "SECURITY_ANALYST"), getRiskScoreByUser);

module.exports = router;