const express = require('express');
const searchCtrl = require('../controllers/search');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, searchCtrl.search);

module.exports = router;
