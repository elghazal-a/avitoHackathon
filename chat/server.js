var request = require('request');
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

  //Mark User as online and stock socketId
  Users.forEach(function(user, i){
  	if(user.userid == socket.userid){
  		user.online = true;
  		user.socketId = socket.id;
  	}
  });

  console.log(Users);
  
  socket.emit('chat:initialize', {
  	users: Users
  });

  socket.on('msg:new', function(data){
  	//data = { msg, to }
  	
  	//Notify data.to that he got a message from socket.userid
  	
  	//send msg to data.to
    
    Users.forEach(function(user, i){
      if(user.userid == data.to){
        //Save msg to db
        request({
          baseUrl: 'http://msg.avito.local',
          url: '/msgs',
          method: 'POST',
          json: true,
          body: {
            from: socket.userid,
            to: data.to,
            msg: data.msg,
          },
        }, function(err, res, body) {
  		  	socket
          .broadcast
  		  	.to(user.socketId)
  		  	.emit('msg:new', {
  		  		from: socket.userid,
  		  		msg: data.msg
  		  	});
        });
	  	}
	  });
  })
});


