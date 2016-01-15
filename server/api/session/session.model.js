'use strict';

const connection = require("../../connection.js");

module.exports.session = function (data, cb) {
	let query = "call sp_sel_opciones_menu( ? )";
	connection(query, data.id, function (err,rows) {
		let opciones = [];
		if(!err && rows && rows[0]){
			opciones = rows[0];
		}
		data.opciones = opciones;
		if (cb) {
			cb(data);
		}
	});
};

module.exports.logout = function (data, cb) {

};
