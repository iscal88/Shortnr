module.exports = function (app) {

	var utilities = require("./utilities")(),
		URL = require("../model/url"),
		Statistic = require('../model/statistic.js'),
		UAParser = require('ua-parser-js');

	// ========================================================================================
	// Método que obtiene toda la información a partir del user-agent de una petición request.
	// Se retorna un objeto Statistic por si se desea guardar en la base de datos MongoDB
	//
	getStatistics = function(req) {
	    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	    var user_agent = req.headers['user-agent'];
	    var parser = new UAParser();
	    parser.setUA(user_agent);

	    var result = parser.getResult();
		var stat = new Statistic({
	    	ip: 				ip,
			browser: 			result.browser,
			os: 				result.os,
			device: 			result.device,
			engine: 			result.engine,
			cpu: 				result.cpu
		});

		return stat;
	};

	// ========================================================================================
	// Método que retorna al usuario toda la información obtenida de su conexión.
	//
	findAllInfo = function(req, res) {
	    var response = getStatistics(req);

	    response.accessDate = new Date();

	    console.log(response);
		res.send(response);
	};

	// ========================================================================================
	//
	findAllURLs = function(req, res) {
		URL.find(function(err, urls) {
			if (!err) res.send(urls);
			else console.log("ERROR: ", err);
		});
	};

	// ========================================================================================
	//
	findURLById = function(req, res) {
		URL.findById(req.params.id, function(err, url) {
			if (!err) res.send(url);
			else console.log("ERROR: ", err);
		});
	};

	// ========================================================================================
	//
	findAllStatistics = function(req, res) {
		Statistic.find(function(err, stats) {
			if (!err) res.send(stats);
			else console.log("ERROR: ", err);
		});
	};

	// ========================================================================================
	//
	findStatisticById = function(req, res) {
		Statistic.findById(req.params.id, function(err, stat) {
			if (!err) res.send(stat);
			else console.log("ERROR: ", err);
		});
	};

	// ===================================================================
	// POST: url-larga. Crea URL corta y la devuelve
	//
	addURL = function(req, res) {

		randomShortURL(function(url){
			var adminKey = randomAdminKey();
			var url = new URL({
				shortUrl: url,
				longUrl: req.body.url,
				insertDate: new Date(),
				adminKey: adminKey
			});

			url.save(function(err) {
				if (!err)
					res.send(url);
				else
					console.log("ERROR: ", err);
			});
	
		}, function(err) {
			console.log("ERROR: ", err);
		});
	};

	// ===================================================================
	// DELETE: Borra x. 
	// Parámetros JSON: { url: "URL", "key": "KEY" }
	//
	deleteURL = function(req, res) {
		var shortUrl = req.body.url;
		var adminKey = req.body.key;

		var aux = shortUrl.split("/");
		shortUrl = aux[aux.length-1];

		// Obtengo el _id de longUrl
		URL.remove({ 'shortUrl': shortUrl, 'adminKey': adminKey }, function(err) {
			if (err) console.log("ERROR: ", err);
			else res.send("OK");
		});
	};

	// ===================================================================
	// POST: Devuelve las estadísticas de acceso. 
	// Parámetros JSON: { url: "URL", "key": "KEY" }
	//
 	urlStatistics = function(req, res) {

		var shortUrl = req.body.url;
		var adminKey = req.body.key;

		var aux = shortUrl.split("/");
		shortUrl = aux[aux.length-1];

		// Obtengo el _id de longUrl
		URL.findOne({ 'shortUrl': shortUrl }).exec(function (err, url) {
			if (err) console.log("ERROR: ", err);

			if (url == null) {
				res.status(404).send("No hay ninguna URL en el sistema con esas credenciales.");
			}
			else {
				console.log("Obteniendo estadísticas de: ", shortUrl, " (", url._id , ")");

				// Busco las estadísticas cuyo idURL == _id
				Statistic.find({ idUrl: url._id }).exec(function(err, stats) {
					if (err) console.log("ERROR: ", err);

					// Saco las estadísticas
					var total = stats.length;
					var deviceMobile = 0, deviceWeb = 0, 
						osWindows = 0, osMac = 0, osAndroid = 0, osIOS = 0, osOther = 0, 
						browserChrome = 0, browserFirefox = 0, browserIE = 0, browserOther = 0;
					for (var i = 0; i < stats.length; i++) {
						var s = stats[i];
						console.log("STAT => ", s);
						// OS
						if (s.os.name == 'Mac OS X') osMac++;
						else if (s.os.name == 'Windows') osWindows++;
						else if (s.os.name == 'Android') osAndroid++;
						else if (s.os.name == 'iOS') osIOS++;
						else osOther++;
						// Device
						if (s.os.name == 'iOS' || s.os.name == 'Android') deviceMobile++; else deviceWeb++;
						// Browser
						if (s.browser.name == 'Chrome') browserChrome++;
						else if (s.browser.name == 'Firefox') browserFirefox++;
						else browserOther++;
					}

					// Retorno los datos
					var outModel = {
						'visits' : total,
						'devices' : {
							'mobile' : deviceMobile,
							'web' : deviceWeb
						},
						'os' : {
							'macOSx' : osMac,
							'windows' : osWindows,
							'android' : osAndroid,
							'ios' : osIOS,
							'other' : osOther,
						},
						'browser' : {
							'chrome' : browserChrome,
							'firefox' : browserFirefox,
							'other' : browserOther
						}
					}

					console.log("outModel: ", outModel);

					res.send(outModel);
				});
			}
		});
	};

	// ===================================================================
	// GET: url-corta. Redirección a la url larga.
	// Se actualizan las estadísticas
	//
	redirect = function (req, res) {
		var shortUrl = req.params.url;

		// Busco el _id de la url
		URL.findOne({ 'shortUrl': shortUrl }).exec(function (err, url) {
			if (err)  {
				console.log("ERROR: ", err);
			}
			else {
				if (url == null) {
					res.status(404).send("No existe ninguna URL como la que se muestra");
				} 
				else {
					var idUrl = url._id;

					// Actualizo las estadísticas
				    var stat = getStatistics(req);
				    stat.accessDate = new Date();
				    stat.idUrl = idUrl;

					stat.save(function(err) {
						if (err) {
							console.log("ERROR: ", err);
						}
						else {
							console.log("Redirect to ", url.longUrl);
							res.redirect(url.longUrl); 
						}
					});
				}				
			}
		});
	};
}