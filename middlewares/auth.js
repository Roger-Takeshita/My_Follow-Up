const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const auth = (req, res, next) => {
    try {
        let token =
            req.get('Authorization') || req.query.token || req.body.token;

        if (token) {
            token = token.replace('Bearer ', '');
            const { user } = jwt.verify(token, JWT_SECRET_KEY);
            if (!user) {
                return res.status(401).json({ message: 'Not authorized.' });
            }
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Invalid token.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while authorizing request. Please try again later.',
        });
    }
};

const createAccessToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: '7d' });
};

module.exports = {
    auth,
    createAccessToken,
};
