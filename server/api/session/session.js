const express = require("express"),
			router = express.Router(),
			passport = require('../../passport.js'),
			controller = require('./session.controller.js');

router.get('/session', controller.session);
router.post('/login' , /*passport.authenticate('local'),*/ controller.login);
router.get('/logout', controller.logout);

module.exports = router;
