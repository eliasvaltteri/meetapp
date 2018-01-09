// initialize db connection
var mongoose = require("mongoose");

// ES6 promises to avoid deprecation warning
mongoose.Promise = Promise;

// declare options for db usage
var localdb 	= "mongodb://localhost/meetapp-db";
var remotedb	= "mongodb://user:pass@ds117156.mlab.com:17156/webtechdb";

// connect
mongoose.connect(remotedb, {
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

module.exports.User = require("./user");
module.exports.Message = require("./message");