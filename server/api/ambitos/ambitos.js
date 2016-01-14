const express = require("express"),
			router = express.Router(),
			passport = require('../../passport.js'),
			controller = require('./ambitos.controller.js');

router.post('/ambitoIn',controller.ambitoIn);
router.post('/ambitoSel', controller.ambitoSel);

// $app->get('/ambitoD/:id','sessionAlive',function($id) use ($app
router.post('/ambitoD/:id', controller.ambitoD);

module.exports = router;
