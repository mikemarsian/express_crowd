var config = require('config');
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.get('db.host')  + '/' + config.get('db.name'));

var db = mongoose.connection;
db.on('error', function callback(err) {console.log("Database connection failed. Error: " + err);});
db.once('open', function callback() {console.log("Database connection successful.");});
