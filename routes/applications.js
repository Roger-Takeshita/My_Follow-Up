const express = require('express');
const router = express.Router();
const applicationCtrl = require('../controllers/applications');

//! Privet Routes
router.use(require('../config/auth'));
router.get('/search', checkAuth, applicationCtrl.search);
router.post('/new', checkAuth, applicationCtrl.newApplication);
router.put('/:id', checkAuth, applicationCtrl.updateApplication);
router.delete('/:id', checkAuth, applicationCtrl.deleteApplication);
router.post('/:id/new', checkAuth, applicationCtrl.newFollowup);
router.delete('/:id/:followId', checkAuth, applicationCtrl.deleteFollowup);
router.get('/', checkAuth, applicationCtrl.getApplications);

function checkAuth(req, res, next) {
    if (req.user) return next();
    return res.status(400).json({ error: 'Not Authorized' });
}

module.exports = router;
