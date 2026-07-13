const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

const isSecurityAnalyst = (req, res, next) => {
    if (req.user.role !== "SECURITY_ANALYST") {
        return res.status(403).json({ message: "Access denied. Security Analyst only." });
    }
    next();
};

function allowRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
}

module.exports = { isAdmin, isSecurityAnalyst, allowRoles };