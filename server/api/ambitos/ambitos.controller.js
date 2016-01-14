const model = require("./ambitos.model.js"),
			passport = require('../../passport.js');

module.exports.ambitoIn = function (req, res) {
	console.log(req.body);
	var query = "select fn_ins_cat_ambito( '?', ? ) as id";
	var data = [req.body.nombre,req.body.codigo];

	connect.query(query,data,function (row) {

		if (row != NULL) {
        r1[0] = "success";
        r1[1] = 'Se agrego correctamente';
		    r1[2] = row[0];

    }else{
        r1[0] = "info";
        r1[1] = 'No fue posible agregar los datos';
				r1[2] = undefined;
    }
		res.json(200,r1);
};

module.exports.ambitoSel = function (req, res) {

};

module.exports.ambitoD = function (req, res) {

};
