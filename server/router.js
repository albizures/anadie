const path = require("path");
const connection = require("./connection.js");
function getIndex(req, res) {
	res.sendFile(path.resolve(__dirname,'..','client', 'index.html'));
}

module.exports = function (app) {
	app.use('/', getIndex);
	app.use('/index', getIndex);
	app.use('/index.html', getIndex);

	app.use(require('./auth.js'));
}
