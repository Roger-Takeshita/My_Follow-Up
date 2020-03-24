const express = require('express');
const router = express.Router();
const applicationCtrl = require('../controllers/applications');
const resumeCtrl = require('../controllers/resumes');

//! Privet Routes
router.use(require('../config/auth'));
router.get('/search/*', checkAuth, applicationCtrl.search);
router.post('/resume/new', checkAuth, resumeCtrl.newResume);
router.get('/resumes', checkAuth, resumeCtrl.getResumes);
router.put('/resume/:id', checkAuth, resumeCtrl.updateResume);
router.delete('/resume/:id', checkAuth, resumeCtrl.deleteResume);
router.post('/application/new', checkAuth, applicationCtrl.newApplication);

function checkAuth(req, res, next) {
    if (req.user) return next();
    return res.status(400).json({ error: 'Not Authorized' });
}

module.exports = router;
