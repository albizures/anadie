const express = require("express"),
			router = express.Router(),
      upload = require('multer')({ dest: './uploads' }),
			passport = require('../../passport.js'),
			controller = require('./eventos.controller.js');

router.post('/uploadFileEvento',upload.single('file'), passport.hasTokenRol, controller.uploadFileEvento);


module.exports = router;
