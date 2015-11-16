var app = require('http').createServer();
var io = require('socket.io')(app);
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Chat Listening on port ' + port);
});

io.use(function(socket, next) {
  var handshakeData = socket.request;
  socket.userid = socket.handshake.query.userid
  next();
});

var users = require('./users');
io.on('connection', function (socket) {
  console.log('Connected to the chat');

  //Mark User as online and stock socketId
  users[socket.userid].online = true;
  users[socket.userid].socketId = socket.id;
});


