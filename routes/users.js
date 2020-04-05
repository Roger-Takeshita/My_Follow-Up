const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');

//! Public routes
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);

//! Private routes
router.use(require('../config/auth'));
router.put('/:id', checkAuth, usersCtrl.updateUser);

function checkAuth(req, res, next) {
    if (req.user) return next();
    return res.status(400).json({ error: 'Not Authorized' });
}

module.exports = router;
