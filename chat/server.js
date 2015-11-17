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

var Users = require('./users');
io.on('connection', function (socket) {
  console.log('Connected to the chat');

  //Mark User as online and stock socketId
  Users.forEach(function(user, i){
  	if(user.userid == socket.userid){
  		user.online = true;
  		user.socketId = socket.id;
  	}
  });
  
  socket.emit('chat:initialize', {
  	users: Users
  });

  socket.on('msg:new', function(data){
  	//data = { msg, to }
  	
  	//Notify data.to that he got a message from socket.userid
  	
  	//send msg to data.to
	  Users.forEach(function(user, i){
	  	if(user.userid == socket.userid){
		  	socket.broadcast
		  	.to(user.socketId)
		  	.emit('msg:new', {
		  		from: socket.userid,
		  		msg: data.msg
		  	});
	  	}
	  });
  })
});


