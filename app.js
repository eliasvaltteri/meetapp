// set up express
var express = require('express')
var app = express()
var http = require('http').Server(app)
app.use(express.static(__dirname + '/client'))

// set up passport and load config
var passport = require('passport')
require('./config/passport')(passport) // pass passport config js

// cookie and session
var cookieParser = require('cookie-parser')
var session = require('express-session')
app.use(session({
	secret: 'yes web can',
	resave: false,
	saveUninitialized: false
}))

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

// body-parser
var bodyParser = require('body-parser')
app.use(bodyParser.json()) //for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
}))

// routes
require('./routes/api.js')(app, passport)

// set up app to listen for port
var server = http.listen(80, function() {
  console.log('meetApp running and listening on port ' + server.address().port + ' !')
})

// websocket config
var ws = require('./config/ws')
module.exports = server