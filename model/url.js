var mongoose = require('mongoose'),
	Schema 	 = mongoose.Schema;

var url = new Schema({
	shortUrl: 		String,
	longUrl: 		String,
	insertDate: 	Date,
	adminKey: 		String
});

module.exports = mongoose.model('URL', url);