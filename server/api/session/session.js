const express = require("express"),
			router = express.Router(),
			passport = require('../../passport.js'),
			controller = require('./session.controller.js');

router.get('/session', controller.session);
router.post('/login' , controller.login, controller.session);
router.get('/logout', controller.logout);

module.exports = router;
