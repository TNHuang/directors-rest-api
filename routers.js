var express = require('express'),
	http = require('http'),
	url = "https://api.new.livestream.com/accounts/",
	Director = require("./apps/models/director"),
	str2md5 = require("./apps/shared/str2md5"); //md5 hasing

var router = express.Router();

//routers progress check for all router
router.user(function(req, res, next){
	console.log("stuff happening");
	next();
});

//basic route test to make sure connection establish to http://localhost:8080/api
router.get("/", function(req, res){
	res.json({ message: "get request succeeds!"})
});

//director post route and directors index route
router.route("/directors")
	.get( function(req, res){
		Director.find(function(err, directors){
			if (err) res.send(err);
			res.json(directors);
		});
	})
	//create a director by passing a livestream_id
	.post( function(req, res){
		var livestream_id = req.body.livestream_id;

	})