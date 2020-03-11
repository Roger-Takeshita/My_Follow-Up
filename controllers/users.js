const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_JWT;

function createJWT(user) {
    return jwt.sign({ user }, SECRET, { expiresIn: '24h' });
}

async function signup(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new User(req.body);
            try {
                await newUser.save();
                const token = createJWT(newUser);

                res.json({ token });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err: 'Something went wrong' });
            }
        } else {
            res.status(400).json({ err: 'Email already taken' });
        }
    } catch (err) {
        res.status(500).json({ err: 'Something went wrong' });
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ err: "User doesn't exist!" });
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch) {
                const token = createJWT(user);
                res.json({ token });
            } else {
                return res.status(400).json({ err: 'Wrong password!' });
            }
        });
    } catch (err) {
        res.status(500).json({ err: 'Something went wrong' });
    }
}

module.exports = {
    signup,
    login
};
