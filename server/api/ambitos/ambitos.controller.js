const model = require("./ambitos.model.js"),
			passport = require('../../passport.js');

module.exports.ambitoIn = function (req, res) {
	console.log(req.body);
	var query = "select fn_ins_cat_ambito( '?', ? ) as id";
	var data = [req.body.nombre,req.body.codigo];

	connect.query(query,data,function (row) {

		if (row != NULL) {
        res[0] = "success";
        res[1] = 'Se agrego correctamente';
		    res[2] = row[0];
			
    }else{
        res[0] = "info";
        res[1] = 'No fue posible agregar los datos';
				res[2] = undefined;
    }
		res.json(200,res);
};

module.exports.ambitoSel = function (req, res) {

};

module.exports.ambitoD = function (req, res) {

};
