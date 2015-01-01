var express = require('express'),
	https = require('https'),
	url = "https://api.new.livestream.com/accounts/",
	Director = require("./apps/models/director"),
	str2md5 = require("./apps/shared/str2md5");

var router = express.Router();

//director post route and directors index route
router.route("/directors")
	//shows all the registered directors
	.get( function(req, res){
		Director.find(function(err, directors){
			if (err) res.send(err);
			res.json(directors);
		});
	})
	//create a director by passing a livestream_id
	.post( function(req, res){
		var lsUrl = url + req.body.livestream_id;

		Director.find({ livestream_id: req.body.livestream_id}, function(err, directors){
			if (directors.length > 0 ){
				res.json({message: "Director account already existed"})
			} 
		})

		//sending request to livestream.com
		var lsRequst = https.get(lsUrl, function(lsRes){
			var buffer = "",
				data;
	
			lsRes.on('data', function(chunk){
				buffer += chunk;
			});
			lsRes.on('end', function(err){
				data = JSON.parse(buffer);
				//if invalid account id -> skip create director
				if (data.message && data.message === "Invalid account id") {
					res.json({message: data.message});
				} else {
					var director = new Director ({
						livestream_id: req.body.livestream_id,
						full_name: data.full_name,
						dob: data.dob				
					});
					director.save(function(err){
						if(err) res.send(err);
						res.json(director);
					});
				}
			});
			
		});// livestream request end
	});

router.route("/directors/:livestream_id")
	.get( function(req, res){
		Director.findOne({
			livestream_id: req.params.livestream_id
		}, function(err, director){
			if (err) res.send(err);
			res.json(director);
		});
	})
	//update the director account if authentication is valid
	.put( function(req, res){
		Director.findOne({
			livestream_id: req.params.livestream_id
		}, function(err, director){
			if (err) res.send(err);
			var dirName = director.full_name;
			//how to handle not found error
			str2md5(dirName, function(hash){
				if (hash === req.headers['authorization'] ){
					Director.update({
						favorite_movies: req.body.favorite_movies.split(","),
						favorite_camera: req.body.favorite_camera
					}, function(err){
						res.json({message: "Updated!"})
					});
				} else {
					res.json({message: "Invalid Token"});
				}
			});
		});
	})
	//delete function -> allow director delete if authorization token is legal
	.delete( function(req, res){
		Director.findOne({
			livestream_id: req.params.livestream_id
		}, function(err, director){
			if (err) res.send(err);
			var dirName = director.full_name;

			str2md5(dirName, function(hash){
				if (hash === req.headers['authorization'] ){
					Director.remove({
						livestream_id: req.params.livestream_id
					}, function(err){
						res.json({message: "Success!"})
					});
				} else {
					res.json({message: "Invalid Token"});
				}
			});

		});
	});



module.exports = router;