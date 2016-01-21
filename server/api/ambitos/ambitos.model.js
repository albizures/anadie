const connection = require("../../connection.js");

module.exports.ambitoIn = function (data,cb) {
	var query = "select fn_ins_cat_ambito( ?, ? ) as id";
	connection(query,data,function (err, rows) {
		var resp = {};
		if(err) {
			resp.status = "info";
			resp.message = 'No fue posible agregar los datos';
			resp.data = undefined;
		}else {
			resp.status = "success";
			resp.message = 'Se agrego correctamente';
			resp.data = rows[0];
		}
		if (cb) {    // que hace aqui???
			cb(resp);
		}
	});
}

module.exports.ambitoSel = function(cb){
		var query = "call sp_sel_cat_ambito( )";
		resp = {};
		connection(query,'',function(err,rows){
			if(err) {
				resp.status = "info";
				resp.message = "No hay ámbitos";
			}
			else {
				resp.data = rows;
				cb(resp.data[0]);
			}
		})
}

module.exports.ambitoD = function(id,cb){
	var query = "call sp_del_cat_ambito(?)";
	connection(query,id,function (err,rows) {
			if(err) {
				resp.status = "error";
				resp.message = "No pudo eliminar los Datos " + err;
			}else {
				resp.status = "success";
				resp.message = "Datos eliminados";
			}
	})

}
