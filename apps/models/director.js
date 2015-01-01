var mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	str2md5 = require("../shared/str2md5");

var directorSchema = mongoose.Schema({
	livestream_id: {type: String, required: true, unique: true},
	full_name: {type: String, required: true, unique: true},
	dob: {type: Date},
	favorite_camera: {type: String, default: "No preference"},
	favorite_movies: [String]
});


directorSchema.plugin(uniqueValidator, { message: "Error, director with that name already existed"});


module.exports = mongoose.model('Director', directorSchema);