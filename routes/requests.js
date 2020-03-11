const express = require('express');
const router = express.Router();
const applicationCtrl = require('../controllers/applications');

//! Privet Routes
router.use(require('../config/auth'));
router.get('/search/*', checkAuth, applicationCtrl.search);

function checkAuth(req, res, next) {
    if (req.user) return next();
    return res.status(401).json({ msg: 'Not Authorized' });
}

module.exports = router;
