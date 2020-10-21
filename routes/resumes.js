const express = require('express');
const resumeCtrl = require('../controllers/resumes');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, resumeCtrl.getResumes);
router.post('/new', auth, resumeCtrl.newResume);
router.put('/:id', auth, resumeCtrl.updateResume);
router.delete('/:id', auth, resumeCtrl.deleteResume);

module.exports = router;
