var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	cors = require('cors'),
	app = express();

var debugMode = true;
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(__dirname + '/public'));

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  user: 'admin',
  pass: 'mZWE6EN-lWWY'
}
mongoose.connect('mongodb://localhost/shortnr', options);

require('./routes')(app, debugMode);

var port =  process.env.OPENSHIFT_NODEJS_PORT || 8080;   // Port 8080 if you run locally
var address =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; // Listening to localhost if you run locally
app.listen(port, address);
console.log("Aplicación iniciada en " + address + ":" + port);
