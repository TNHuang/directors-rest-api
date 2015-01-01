var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator');

var directorSchema = mongoose.Schema({
	livestream_id: {type: String, required: true, unique: true},
	full_name: {type: String, required: true, unique: true},
	dob: {type: Date},
	favorite_camera: {type: String},
	favorite_movies: [String],
	passHash: {type: String}
});

//name uniquness validation
directorSchema.pre("save", function(next, done){
	var self = this;
	this.models['Director'].findOne({ full_name: self.full_name}, function(err, results){
		if (err) {
			done(err);
		} else if (results) {//found the name in the record, name already existed
			self.invalidate("full_name", "name must be unique");
			done(new Error("name must be unique"));
		} else {
			done();
		}
	});
	next();
});