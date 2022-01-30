const jwt = require('jsonwebtoken');

const keys = require('../config/keys');

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).json({ msg: "No authentication token, authorization denied" });
        }
        const verified = jwt.verify(token, keys.secretOrKey);
        if (!verified) {
            return res.status(401).json({ msg: "token verification failed, authorization denied" });
        }
        req.user = verified.id;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = auth;