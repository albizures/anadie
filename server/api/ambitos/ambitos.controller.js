const model = require("./ambitos.model.js"),
			passport = require('../../passport.js');

module.exports.ambitoIn = function (req, res) {
	var data = [req.body.nombre,req.body.codigo];
	model.ambitoIn(data,function (resp) {
		res.json(resp);
	});
};

module.exports.ambitoSel = function (req, res) {

};

module.exports.ambitoD = function (req, res) {

};
