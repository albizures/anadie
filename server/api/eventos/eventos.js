const express = require("express"),
			router = express.Router(),
      upload = require('multer')({ dest: './uploads' }),
			passport = require('../../passport.js'),
			controller = require('./eventos.controller.js');

router.post('/uploadFileEvento', passport.hasTokenRol, upload.single('file'), controller.uploadFileEvento);


module.exports = router;
