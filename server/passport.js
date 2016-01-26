'use strict';

const express = require("express"),
			router = express.Router(),
			passport = require("passport"),
			passwordUtils = require("./utils/password"),
			connection = require('./connection.js'),
			LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
	console.log('serializeUser');
		// TODO: aqui hay que pasar solo la informacion esencial
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
		let query  = "call sp_sel_seg_usuario(?)";
		connection(query, username, function (err, rows) {
			if(err){// se Verifica si dio error la consulta
				return done(err);
			}
			if (!rows || !rows[0] || !rows[0][0]) {// se verifica que haya devuelto algun usuario la consulta
        return done(null, false, { message: 'Incorrect username.' });
      }
			if (!passwordUtils.checkPassword(rows[0][0].clave, password)) {// se valida la contraseña
				return done(null, false, { message: 'Incorrect password.' });
			}
			// se pone toda la informacion que viene en el sp en la variable de sesion
			// si se quieren quitar datos, hacer un nuevo objecto y pasarlor
			return done(null, rows[0][0]);
		});

  }
));



module.exports = passport;

module.exports.hasRol = function (req, res, next) {

};
module.exports.isAuthenticated = function (req, res, next) {

};
module.exports.isTokenAuthenticated = function (req, res, next) {
  // aqui se tiene que validar si el toquen existe
  // por el momento solo verifico que exite el parametro token
  if (req.body.token) {
    next();
  }else {
    res.status(401).end();
  }
};
module.exports.hasTokenRol = function (req, res, next) {
  // se valida si tiene algun rol
  // por el momento solo verifico que existe el paramentro token
  if (req.body.token) {
    next();
  }else {
    res.status(401).end();
  }
}
