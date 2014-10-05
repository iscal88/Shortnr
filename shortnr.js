var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	cors = require('cors'),
	app = express();

var debugMode = true;
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(__dirname + '/public'));


mongoose.connect('mongodb://127.0.0.1/urls', function(err, res) {
	if (err) console.log("ERROR: Conectando a la base de datos: ", err);
	else console.log('Conexión a la base de datos realizada correctamente.');
});

require('./routes')(app, debugMode);

app.listen(8000, function() {
	console.log("Aplicación iniciada en http://localhost:8000");
});

