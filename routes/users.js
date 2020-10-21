const express = require('express');
const usersCtrl = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);

router.put('/:id', auth, usersCtrl.updateUser);
// TODO DELETE

module.exports = router;
