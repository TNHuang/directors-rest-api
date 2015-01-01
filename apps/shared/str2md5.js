
//convert str to md5 hash, unfortunatley crypto cannot be reuse, need to redeclare each time
function str2md5(str, callback){
	var output = "Bearer " + require('crypto').createHash('md5').update(str).digest('base64');
	callback(output);
}
module.exports = str2md5;