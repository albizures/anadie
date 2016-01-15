const express = require("express"),
			passport = require("./passport.js"),
			bodyParser = require('body-parser'),
			path = require("path");
module.exports = function (app) {
	app.use('/client',express.static(path.resolve(__dirname,'..','client')));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(passport.initialize());
	app.use(passport.session());
};
