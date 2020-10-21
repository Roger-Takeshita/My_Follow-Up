const express = require('express');
const applicationCtrl = require('../controllers/applications');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, applicationCtrl.getApplications);
router.post('/new', auth, applicationCtrl.newApplication);
router.put('/:id', auth, applicationCtrl.updateApplication);
router.delete('/:id', auth, applicationCtrl.deleteApplication);

router.post('/:id/new', auth, applicationCtrl.newFollowup);
router.put('/:id/:followId', auth, applicationCtrl.updateFollowup);
router.delete('/:id/:followId', auth, applicationCtrl.deleteFollowup);

module.exports = router;
