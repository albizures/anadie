const express = require("express"),
			app = express();

require('./config.js')(app);
require('./router.js')(app);


app.listen(3000, function () {
	console.log('server run');
});
