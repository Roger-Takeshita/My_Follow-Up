const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_JWT;

module.exports = function(req, res, next) {
    let token = req.get('Authorization') || req.query.token || req.body.token;
    if (token) {
        token = token.replace('Baerer ', '');
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) {
                next(err);
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } else {
        next();
    }
};
