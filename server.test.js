var superagent = require('superagent'),
	server = require('./server'),
	mongoose = require('mongoose'),
	expect = require('expect.js');

describe('directors-rest-api CRUD tests', function(){
	var id;
	var passHash = "Bearer " + require('crypto').createHash('md5').update("James Cameron").digest('base64');

	//reset database between each test
	before(function (done) {
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

	after(function (done) {
	 	mongoose.disconnect();
	 	server.close();
	 	return done();
	});


	//false postive test, should not be getting any account if livestream_id did not exist
	it('livestream id validation=> should not return result for invalid id', function(done){
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

	it('director uniquness validation => should be unable to make duplicate director', function(done){
		superagent.post('http://localhost:8080/api/directors')
			.send({ "livestream_id": 6488824})
			.end( function(err, res){
				expect(err).to.eql(null);
				expect(res.body.message).to.eql("Director account already existed");
				return done();
			})
	});
	

	it('retrieve a director with the correct information', function(done){
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

	it('retrieve a collection of directors', function(done){
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

	// negative test for update authorization
	it('update authorization validation => should be unable to update if given the wrong token', function(done){

		superagent.put('http://localhost:8080/api/directors/' + id)
			.set({'Authorization': "wrongToken" })
			.send({
				favorite_camera: "Sony F65",
				favorite_movies: "Avatar1,Terminator1,Titanic1"
			})
			.end(function(err, res){
				expect(res.statusCode).to.eql(401);
				expect(res.body.message).to.eql("Invalid Token");
				return done();
			});
	})

	//set up a sample test for updating director
	it('updates an director', function(done){

		superagent.put('http://localhost:8080/api/directors/' + id)
			.set({'Authorization': passHash })
			.send({
				favorite_camera: "Sony F65",
				favorite_movies: "Avatar,Terminator,Titanic"
			})
			.end(function(err, res){

				expect(err).to.eql(null);
				expect(res.body.message).to.eql("Updated!");
				return done();
			});
	})

	//check on update status
	it('checks an updated director for correct updated information', function(done){
		superagent.get('http://localhost:8080/api/directors/' + id)
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.favorite_camera).to.eql("Sony F65");
				expect(res.body.favorite_movies).to.eql(["Avatar", "Terminator", "Titanic"]);
				return done();
			});
	});

	// negative test for remove function
	it('delete authorization validation=> should be unable to delete with wrong token', function(done){
		superagent.del('http://localhost:8080/api/directors/' + id)
			.set({'Authorization': "wrongToken" })
			.end(function(err, res){
				expect(res.statusCode).to.eql(401);
				expect(res.body.message).to.eql('Invalid Token');
				return done();
			});
	})

	//optional test, it remove the object
	it('remove a director', function(done){
		superagent.del('http://localhost:8080/api/directors/' + id)
			.set({'Authorization': passHash })
			.end(function(err, res){
				expect(err).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.message).to.eql('Success!');
				return done();
			});
	});


});
