module.exports = function () {

	var URL = require("../model/url");

	// Función que genera una url aleatoria (que no esté utilizada)
	randomShortURL = function(call, callErr) {

		var shortURL = randomHex(7);

		var query = URL.findOne({ 'shortUrl': shortURL });
		query.exec(function (err, url) {
			if (callErr && err) 
				callErr(err);
			if (call && url == null)
				call(shortURL);
			else
				randomShortURL(call, callErr);
		});
	};

	// Función que genera una key aleatoria
	randomAdminKey = function() {
		return randomHex(6);
	};

	randomHex = function (l) {
		var values = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		return (function co(lor){   
			return (lor += values[Math.floor(Math.random()*values.length)]) && 
				   (lor.length == l) ? lor : co(lor); 
		})('');
	};


}
