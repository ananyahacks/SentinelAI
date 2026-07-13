const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {

    try {

        let token = req.cookies.token;

        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Login first."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = auth;