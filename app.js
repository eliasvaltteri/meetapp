const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const app = express()

// express config
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

// websocket config
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
module.exports = wss
const ws = require('./config/ws')

// set up app to listen for port
server.listen(80, function listening() {
  console.log('Listening on %d', server.address().port)
})
