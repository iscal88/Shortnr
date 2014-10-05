var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var statistic = new Schema({
	idUrl: 				String, // FK
	accessDate: 		Date,
	ip: 				String,
	browser: {
		name: 			String,
		version: 		String,
		major: 			String 
	},
	os: {
		name: 			String,
		version: 		String 
	},
	device: {
		model: 			String,
		vendor: 		String,
		type: 			String
	},
	engine: {
		name: 			String
	},
	cpu: {
		architecture: 	String
	}
});

module.exports = mongoose.model('Statistic', statistic);