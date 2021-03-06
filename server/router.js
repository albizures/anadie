const path = require("path"),
			connection = require("./connection.js");

function getIndex(req, res) {
	res.sendFile(path.resolve(__dirname,'..','client', 'index.html'));
}

module.exports = function (app) {

	app.use('/server/api/', require('./api/session/session.js'));
	app.use('/server/api/', require('./api/ambitos/ambitos.js'));
  app.use('/server/api/', require('./api/file/file.js'));
  app.use('/server/api/', require('./api/eventos/eventos.js'));

	app.use('/', getIndex);
	app.use('/index', getIndex);
	app.use('/index.html', getIndex);
}
