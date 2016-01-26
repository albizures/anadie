const express = require("express"),
			passport = require("./passport.js"),
			bodyParser = require('body-parser'),
			session = require('express-session'),
      cors = require('cors')
			cookieParser = require('cookie-parser'),
			path = require("path");
module.exports = function (app) {
  app.use(function (req, res, next) {
    console.log(req.originalUrl);
    next();
  });
  app.use(cors());
	app.use('/client', express.static(path.resolve(__dirname,'..','client')));
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(session({
		resave: false,
		saveUninitialized: true,
		secret:'secret'
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function (req, res, next) {
		console.log(req.user);
		next();
	});
};
