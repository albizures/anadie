const express = require("express"),
			router = express.Router(),
			passport = require('../../passport.js'),
			controller = require('./ambitos.controller.js');

router.post('/ambitoIn',controller.ambitoIn);
router.get('/ambitoSel', controller.ambitoSel);
router.get('/ambitoD/:id', controller.ambitoD);

module.exports = router;
