// load the things we need
var mongoose = require('mongoose');

// define the schema for our message model
var messageSchema = mongoose.Schema({
	event: String,
	name: String,
	message: String
});

// create the model for messages and expose it to our app
module.exports = mongoose.model('Message', messageSchema);