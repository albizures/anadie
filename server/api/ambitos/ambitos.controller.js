const model = require("./ambitos.model.js"),
			passport = require('../../passport.js');

module.exports.ambitoIn = function (req, res) {
	var data = [req.body.nombre,req.body.codigo];

	model.ambitoIn(data,function (resp) {
		res.json(resp);
	});
};

module.exports.ambitoSel = function (req, res) {
	model.ambitoSel(function(resp){
		res.json(resp);
	})
};

module.exports.ambitoD = function (req, res) {
	var id = parseInt(req.params.id);
	model.ambitoD(id,function(resp){
		res.json(resp);
	});

};
