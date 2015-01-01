var crypto = require('crypto'),
	myMd5 = crypto.createHash('md5');

//convert str to md5 hash
function str2md5(str){
	return myMd5.update(str).digest('hex');
}

module.exports = str2md5;