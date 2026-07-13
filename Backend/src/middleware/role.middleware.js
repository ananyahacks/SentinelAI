const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
};

const isSecurityAnalyst = (req, res, next) => {
    if (req.user.role !== "SECURITY_ANALYST") {
        return res.status(403).json({
            message: "Access denied. Security Analyst only."
        });
    }

    next();
};

module.exports = {
    isAdmin,
    isSecurityAnalyst
};