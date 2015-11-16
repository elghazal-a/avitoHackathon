var app = require('http').createServer();
var io = require('socket.io')(app);
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Chat Listening on port ' + port);
});

io.on('connection', function (socket) {
  console.log('Connected to the chat');
});


