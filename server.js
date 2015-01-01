var express = require('express'),
	http = require('http'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	router = require('./routers'),
	uri = 'mongodb://127.0.0.1:27017/myDirectors';

//connect to localhost mongoDB server
options = { server:{
			auto_reconnect: true,
			poolSize: 10,
			socketOptions: {
				keepAlive: 1
			}
		},
		db: {
			numberOfRetries: 10,
			retryMiliSeconds: 1000
		}
	};
mongoose.createConnection(uri, options);

var port = process.env.PORT || 8080;

//enable post request processor
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json());

//registered all routes with /api prefix
app.use("/api", router);

//listen to port via http, since express 4.0 don't bunlde http anymore
var server = http.createServer(app).listen(port);

console.log("api listening on port ", port);



//expose the server
module.exports = server;