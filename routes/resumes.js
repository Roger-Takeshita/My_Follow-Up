const express = require('express');
const router = express.Router();
const resumeCtrl = require('../controllers/resumes');

//! Privet Routes
router.use(require('../config/auth'));
router.post('/new', checkAuth, resumeCtrl.newResume);
router.get('/', checkAuth, resumeCtrl.getResumes);
router.put('/:id', checkAuth, resumeCtrl.updateResume);
router.delete('/:id', checkAuth, resumeCtrl.deleteResume);

function checkAuth(req, res, next) {
    if (req.user) return next();
    return res.status(400).json({ error: 'Not Authorized' });
}

module.exports = router;
