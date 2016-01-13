const express = require("express"),
			router = express.Router(),
			controller = require('./controller.js');

router.get('/session', controller.session);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
