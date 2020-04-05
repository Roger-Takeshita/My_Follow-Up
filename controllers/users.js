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
                console.log('Something went wrong', err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        } else {
            console.log('Email already taken');
            res.status(400).json({ error: 'Email already taken' });
        }
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User doesn't exist!");
            return res.status(404).json({ error: "User doesn't exist!" });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch) {
                const token = createJWT(user);
                res.json({ token });
            } else {
                console.log('Wrong password');
                return res.status(400).json({ error: 'Wrong password!' });
            }
        });
    } catch (err) {
        console.log('Something went wrong');
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateUser(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User doesn't exist!");
            return res.status(404).json({ error: "User doesn't exist!" });
        }
        user.comparePassword(req.body.password, async (err, isMatch) => {
            if (isMatch) {
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                if (req.body.newPassword !== '') {
                    user.password = req.body.newPassword;
                }
                await user.save();
                const token = createJWT(user);
                res.json({ token });
            } else {
                console.log('Wrong password');
                return res.status(400).json({ error: 'Wrong password!' });
            }
        });
    } catch (err) {
        console.log('Something went wrong');
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    signup,
    login,
    updateUser
};
