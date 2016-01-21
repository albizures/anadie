const model = require("./session.model.js"),
			passport = require('../../passport.js');

module.exports.logout = function (req, res) {

};
module.exports.session = function (req, res) {
	if (!req.user){
		res.status(401);
		return res.json({
			status : "error",
			message : 'Aun no ha iniciado sesion.'
		});
	}
	model.session(req.user, function (resp) {
		resp.status = "success";
		res.json(resp);
	});
};

module.exports.login = function (req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			return res.json({
<<<<<<< HEAD
				status : 'erroro',
				message : 'Falló el ingreso al sistema. Datos de ingreso incorrectos'
=======
				status : 'error',
				message : 'Falló el ingreso al sistema. Datos de ingreso incorrectos.'
>>>>>>> 0240437f63426398c5c84d80ab805ff06ee57a90
			});
		}
		req.login(user, function(err) {
			if (err) {
				return res.json({
					status : 'error',
<<<<<<< HEAD
					message : 'Falló el ingreso al sistema. Datos de ingreso incorrectos'
=======
					message : 'Falló el ingreso al sistema. Datos de ingreso incorrectos.'
>>>>>>> 0240437f63426398c5c84d80ab805ff06ee57a90
				});
			}
			return next();
		});
  })(req, res, next);
};
