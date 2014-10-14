var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    cors = require('cors'),
    app = express();

var debugMode = false;
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(__dirname + '/public'));

require('./routes')(app, debugMode);

var connection_string = '127.0.0.1:27017/shortnr';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect('mongodb://' + connection_string, function(err, db) {
        if (err) console.log("ERROR de conexión a la BD.");
        else console.log("Conectado correctamente a la base de datos");
});

var port =  process.env.OPENSHIFT_NODEJS_PORT || 8080;   // Port 8080 if you run locally
var address =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; // Listening to localhost if you run locally
app.listen(port, address);
console.log("Aplicación iniciada en " + address + ":" + port);