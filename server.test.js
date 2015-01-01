var server = require('./server'),
	superagent = require('superagent'),
	mongoose = require('mongoose'),
	expect = require('expect.js');


//utility require
var str2md5 = require('./apps/shared/str2md5'),
	Director = require("./apps/models/director");

describe('directors-rest-api', function(){
	var id,
		passHash = str2md5("James Cameron", function(e){ return e;});

	server.listen(8080)
	//reset database between each test
	beforeEach(function (done) {
	 function clearDB() {
	   for (var i in mongoose.connection.collections) {
	     mongoose.connection.collections[i].remove(function() {});
	   }
	   return done();
	 }

	 if (mongoose.connection.readyState === 0) {
	   mongoose.connect("mongodb://127.0.0.1:27017/myDirectors", function (err) {
	     if (err) {
	       throw err;
	     }
	     return clearDB();
	   });
	 } else {
	   return clearDB();
	 }
	});

	afterEach(function (done) {
	 mongoose.disconnect();
	 return done();
	});


	//false postive test, should not be getting any account if livestream_id did not exist
	it('should not return result for none-exisiting livestream_id', function(done){
		superagent.post('http://localhost:8080/api/directors')
		.send({ "livestream_id": 0})
		.end( function(err, res){
			expect(res.body.message).to.eql("Invalid account id");
			return done();
		});
	});

	it('post a new director', function(done){
		superagent.post('http://localhost:8080/api/directors')
			.send({ "livestream_id": 6488824})
			.end( function(err, res){
				
				expect(err).to.eql(null);
				expect(res.body.length).to.not.eql(null);
				id = res.body.livestream_id;
				return done();
			})
	});

	// //post an existing record should get an 11000 error

	it('retrieves a director with the correct information', function(done){
		superagent.get('http://localhost:8080/api/directors/' + id)
			.end(function(err, res){
				//console.log(res.body);
				expect(err).to.eql(null);
				
				expect(typeof res.body).to.eql('object');
				expect(res.body.livestream_id).to.eql(id);
				expect(res.body.full_name).to.eql("James Cameron");
				expect(res.body.dob).to.eql("1954-08-16T00:00:00.000Z");
				return done();
			});
	});

	it('retrieves a collection of directors', function(done){
		superagent.get("http://localhost:8080/api/directors")
			.end(function(err, res){
				//console.log(res.body);
				expect( err ).to.eql(null);
				expect( res.body.length ).to.be.above(0);
				expect( res.body.map(function(item){
						return item.livestream_id
						})).to.contain(id);
				return done();
			});
	});

	//set up a sample test for updating director
	it('updates an director', function(done){
		superagent.put('http://localhost:8080/api/directors/' + id)
			.set({'Authorization': passHash , 'Content-Type': 'application/json' })
			.send({
				favorite_camera: "Sony F65",
				favorite_movies: ["Avatar", "Terminator", "Titanic"]
			})
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(res.body.message).to.eql("Updated!");
				return done();
			});
	})


	//negative test for trying to modify name and dob, also case for wrong password in the header

	//check on update status
	it('checks an updated director', function(done){
		superagent.get('http://localhost:8080/api/directors/' + id)
		.end(function(err, res){
			expect(err).to.eql(null);
			expect(typeof res.body).to.eql('object');
			expect(res.body.favorite_camera).to.eql("Sony F65");
			expect(res.body.favorite_movies).to.eql(["Avatar", "Terminator", "Titanic"]);
			return done();
		});
	});

	//optional test, it remove the object
	it('remove a director', function(done){
		superagent.del('http://localhost:8080/api/directors/' + id)
		.end(function(err, res){
			expect(err).to.eql(null);
			expect(typeof res.body).to.eql('object');
			expect(res.body.message).to.eql('Success!');
			return done();
		});
	});

	//other nil positive test-> delete non existing record, deletion require authorization hash, etc

});
