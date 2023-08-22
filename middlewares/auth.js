const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'no token present' });
    token = token.split(' ')[1];

    // payload contains user id,role, username, email, and full name 
    jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) return res.status(401).json({ error: err.message });
        req.user = payload;
        // move to the destined endpoint
        next();
    });

}

const verifyAdmin = (req, res, next) => {
    // return error if it is not admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'not authorized' });
    }
    else if (req.user.role === 'admin') {
        next();
    }
};


module.exports = { verifyUser, verifyAdmin };

