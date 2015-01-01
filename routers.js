var express = require('express'),
	https = require('https'),
	url = "https://api.new.livestream.com/accounts/",
	Director = require("./apps/models/director");

var router = express.Router();

//routers progress check for all router
router.use(function(req, res, next){
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
		var lsUrl = url + req.body.livestream_id;

		//sending request to livestream.com
		var lsRequst = https.get(lsUrl, function(lsRes){
			var buffer = "",
				data, attrs;
	
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
						if (err && (err.code === 11000 || err.code === 11001) ){
							res.json({message: "full_name is not unique"})
						} else if (err){
							res.send(err);
						}
						res.json(director);
					});
				}
			});

		});
	});



module.exports = router;