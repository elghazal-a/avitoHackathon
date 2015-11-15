var app = require('http').createServer();
var io = require('socket.io')(app);

app.listen(process.env.PORT || 3000);


io.on('connection', function (socket) {
  console.log('Connected to the chat');
});