'use strict';

const express = require("express"),
			router = express.Router(),
			passport = require("passport"),
			passwordUtils = require("./utils/password"),
			connection = require('./connection.js'),
			LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
	console.log('serializeUser');
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	console.log('deserializeUser');
	done(null, obj);
});

passport.use(new LocalStrategy({
			usernameField: 'username',
      passwordField: 'password'
	}, function(username, password, done) {
		console.log("LocalStrategy working...",password);
		let query  = "call sp_sel_seg_usuario(?)";
		connection(query, username, function (err, rows) {
			console.log(err, rows);
			if(err){// se Verifica si dio error la consulta
				return done(err);
			}
			if (!rows || !rows[0]) {// se verifica que haya devuelto algun usuario la consulta
        return done(null, false, { message: 'Incorrect username.' });
      }
			if (!passwordUtils.checkPassword()) {// se valida la contraseña
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, rows[0]);
		});

  }
));



module.exports = passport;
