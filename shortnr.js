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

var port =  process.env.OPENSHIFT_NODEJS_PORT || 8080;   // Port 8080 if you run locally
var address =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; // Listening to localhost if you run locally
app.listen(port, address);
console.log("Aplicación iniciada en " + address + ":" + port);
