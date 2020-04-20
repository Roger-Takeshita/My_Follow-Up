const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_JWT;

function createJWT(user) {
    return jwt.sign({ user }, SECRET, { expiresIn: '24h' });
}

async function addTries(user, res) {
    try {
        let count = (user.unsuccessfulLogins += 1);
        let tries = 6;
        await user.save();
        if (tries - user.unsuccessfulLogins !== 0) {
            res.status(400).json({
                error: `Wrong password, you have ${tries - count} more ${
                    tries - count === 1 ? 'try' : 'tries'
                }`
            });
        } else {
            res.status(400).json({
                error: `You have been blocked for 5 min`
            });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function checkTimeElapsed(user) {
    let tries = user.unsuccessfulLogins;
    switch (true) {
        case tries <= 5:
            return true;
        case tries > 5:
            if ((new Date() - user.updatedAt) / 1000 / 60 >= 5) {
                user.unsuccessfulLogins = 0;
                await user.save();
                return true;
            }
            return false;
        default:
            return false;
    }
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
                res.status(500).json({ error: 'Something went wrong' });
            }
        } else {
            res.status(400).json({ error: 'Email already taken' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function login(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist!" });
        }
        if (await checkTimeElapsed(user)) {
            user.comparePassword(req.body.password, async (err, isMatch) => {
                if (isMatch) {
                    user.unsuccessfulLogins = 0;
                    await user.save();
                    const token = createJWT(user);
                    return res.json({ token });
                } else {
                    addTries(user, res);
                }
            });
        } else {
            const remainingTime = Math.ceil(5 - (new Date() - user.updatedAt) / 1000 / 60);
            res.status(400).json({
                error: `You have been blocked for 5 min, try again in ${remainingTime} ${
                    remainingTime === 1 ? 'min' : 'mins'
                }`
            });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateUser(req, res) {
    try {
        if (req.user._id === '5e8bab22dc743074b97c758b') {
            return res.status(400).json({ error: "Sorry this user can't be changed!!" });
        } else {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
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
                    res.status(400).json({ error: 'Wrong password!' });
                }
            });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    signup,
    login,
    updateUser
};
