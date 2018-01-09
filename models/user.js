// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our event model
var eventSchema = mongoose.Schema({
  username: String,
  password: String,
  date: { type: Date },
  location: String,
  description: String,
  photourl: String
});

// generating a hash
eventSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
eventSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for events and expose it to our app
module.exports = mongoose.model('User', eventSchema);