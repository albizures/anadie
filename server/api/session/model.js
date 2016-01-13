const connection = require("../../connection.js"),
			password = require("../../utils/password.js");

module.exports.login = function (data, cb) {
	let query  = "call sp_sel_seg_usuario(?)";
	connection(query, data, function (err, rows) {
		if(err){
			console.error('error');
		}
		if (password.checkPassword()) {

		}
	});
};

module.exports.logout = function (data, cb) {

};
