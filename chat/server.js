var request = require('request');
var app = require('http').createServer();
var io = require('socket.io')(app);
var port = process.env.PORT || 3000;
var redis = require('redis');
var client = redis.createClient(process.env.REDIS_1_PORT_6379_TCP_PORT, process.env.REDIS_1_PORT_6379_TCP_ADDR, {});
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
  client.set("socketid:" + socket.userid, socket.id);
  Users.forEach(function(user, i){
  	if(user.userid == socket.userid){
  		user.online = true;
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
      client.get("socketid:" + data.to, function(err, socketid){
  	  	socket
        .broadcast
  	  	.to(socketid)
  	  	.emit('msg:new', {
  	  		from: socket.userid,
  	  		msg: data.msg
  	  	});
      });
    });
  });


  socket.on('disconnect', function(){
    client.del("socketid:" + socket.userid);
  });
});


