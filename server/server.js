#!/usr/bin/env node
var app = require('./app');

// set up port
app.set('port', process.env.PORT || 3000);

// set up app to listen for port
var server = app.listen(app.get('port'), function() {
  console.log('meetApp running and listening on port ' + server.address().port + ' !');
});