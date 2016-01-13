const express = require("express"),
			path = require("path");
module.exports = function (app) {
	app.use('/client',express.static(path.resolve(__dirname,'..','client')));
};
