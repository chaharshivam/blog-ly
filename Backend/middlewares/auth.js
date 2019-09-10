const jwt = require('jsonwebtoken');

exports.generateToken = function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
}

exports.verifyToken = function(req, res, next) {
    const token = req.headers.authorization || "";

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            
            if (err) return res.status(400).json({ error: "Invalid Token"});
            
            req.userId = decoded.userId;

            next();
        });
    } else {
        return res.status(401).json({ error: "Unauthorized access" });
    }
}