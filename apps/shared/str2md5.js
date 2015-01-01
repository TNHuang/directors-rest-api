var crypto = require('crypto'),
	md5 = crypto.createHash('md5');

//convert str to md5 hash
function str2md5(str, callback){
	var output = md5.update(str).digest('hex').toString();
	callback(output);
}

module.exports = str2md5;