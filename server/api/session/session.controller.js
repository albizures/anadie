const model = require("./session.model.js"),
			passport = require('../../passport.js');

module.exports.logout = function (req, res) {

};
module.exports.session = function (req, res) {

};

module.exports.login = function (req, res, next) {
	passport.authenticate('local',  (err, user, info) => {
		console.log(err,user,info);
		console.log(req.body,req.user);
		res.json([]);
	})(req, res, next);
};
