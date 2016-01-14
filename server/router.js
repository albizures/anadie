const path = require("path"),
			connection = require("./connection.js");

function getIndex(req, res) {
	res.sendFile(path.resolve(__dirname,'..','client', 'index.html'));
}

module.exports = function (app) {

	app.use('/server/api/', require('./api/session/session.js'));



	app.use('/', getIndex);
	app.use('/index', getIndex);
	app.use('/index.html', getIndex);
}
