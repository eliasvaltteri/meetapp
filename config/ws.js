// basic config of the ws
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 40510});

// load up the message model
var Message = require('../models/message');

// broadcast
wss.broadcast = (data) => {
	wss.clients.forEach(function(client) {
		client.send(data);
	});
};

// function to broadcast only to sender
wss.sendToSender = (data) => {
	wss.clients.forEach(function(client) {
		if (client == wss) client.send(data);
	});
};

// handle connections
wss.on('connection', (ws) => {

	// handle messages by their types
	ws.on('message', function(msg) {
		data = JSON.parse(msg);

		// client is ready, query for events messages and send them to client
		if (data.type == "loadMsg") {
			Message.find({'event': data.event }, function (err, messages) {
				if (err) return handleError(err);
				messages.forEach(function(thisMsg) {
					ws.send('<p class="message"><span class="msg-name"> ' + thisMsg.name + '</span> ' + thisMsg.message + '</p>');
				});
			});
		}

		// save the new message to db and pass it back to the client
		if (data.type == "newMsg") {
			// save the message to db
			if (data.message) {
				Message.create({
					event: data.event,
					name : data.name,
					message: data.message
				}, function (err, msg) {
					if (err) return handleError(err);
					console.log("Message saved to db!");
				});
				wss.broadcast('<p class="message"><span class="msg-name"> ' + data.name + '</span> ' + data.message + '</p>');
			}
		}
	});

	// prevent the app from crashing on error
	ws.on('error', () => ws.terminate());
});