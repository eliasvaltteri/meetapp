// initialize db connection
var mongoose = require("mongoose");

// ES6 promises to avoid deprecation warning
mongoose.Promise = Promise;

// connect
mongoose.connect('mongodb://localhost/meetapp-db', {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

var db = mongoose.connection;

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));

// mongodb connection open
db.once('open', () => {
  console.log('Connected to mongodb!')
});

mongoose.set("debug", true);

module.exports.User = require("./user");