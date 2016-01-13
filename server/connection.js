const mysql = require("mysql");

var pool  = mysql.createPool({
	connectionLimit : 10,
	database : 'db_anadie',
	host : 'localhost',
	user : 'root',
	password : ''
});



module.exports = function (query, data, cb) {
	pool.getConnection(function(err, connection) {
		connection.query(query, data, onQuery);
		function onQuery(err, rows) {
			if (cb){
				cb(err, rows);
			}
			connection.release();
		}
	});
}
