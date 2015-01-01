
//convert str to md5 hash
function str2md5(str, callback){
	var output = require('crypto').createHash('md5').update(str).digest('base64');
	callback(output);
}
module.exports = str2md5;