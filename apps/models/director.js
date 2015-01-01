var mongoose = require('mongoose');

var directorSchema = mongoose.Schema({
	livestream_id: {type: String, required: true, unique: true},
	full_name: {type: String, required: true, unique: true},
	dob: {type: Date},
	favorite_camera: {type: String, default: "No preference"},
	favorite_movies: [String]
});


module.exports = mongoose.model('Director', directorSchema);