

module.exports.ambitoIn = function (data,cb) {
	var query = "select fn_ins_cat_ambito( '?', ? ) as id";

	connect.query(query,data,function (err, rows) {
		var resp = {};
		if(err) {
			resp.status = "info";
			resp.message = 'No fue posible agregar los datos';
			resp.data = undefined;
		}else {
			resp.status = "success";
			resp.message = 'Se agrego correctamente';
			resp.data = row[0];
		}
		if (cb) {
			cb(resp);
		}
	});
}
