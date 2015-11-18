var request = require('request');
var app = require('http').createServer();
var io = require('socket.io')(app);
var port = process.env.PORT || 3000;
var async = require('async');
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

  async.waterfall([
    function(callback){
      //Mark User as online
      request({
        baseUrl: 'http://user.avito.local',
        url: '/users/setonline',
        method: 'PATCH',
        json: true,
        body: {
          userid: socket.userid,
          online: true
        },
      }, function(err, res, body) {
        callback(err);
      });
    },
    function(callback){
      //stock socketId
      client.set("socketid:" + socket.userid, socket.id, function(err){
        callback(err);
      });
    },
    function(callback){
      // Get users we already had chat before
      request({
        baseUrl: 'http://msg.avito.local',
        url: '/msgs/' + socket.userid,
        method: 'GET',
        json: true,
      }, function(err, res, body) {
        callback(err, body);
      });
    },
    function(users, callback){
      /*
      users = [ 
        { msgs: [ [Object] ],
          delivred: false,
          owners: [ '2', '1' ] 
        }
      */
      //make some filters
      users.forEach(function(user, i){
        user.lastMsg = user.msgs[0];
        if(user.owners[0] == socket.userid)
          user.userid = user.owners[1];
        else user.userid = user.owners[0];
      });
      callback(null, users);
    },
    function(users, callback){
      //get usernames and status
      request({
        baseUrl: 'http://user.avito.local',
        url: '/users/ids-to-users',
        method: 'POST',
        json: true,
        body: {
          users: users
        }
      }, function(err, res, body) {
        callback(err, body);
      });
    }
  ], function (err, users) {
    // console.log(users);
    

    socket.emit('chat:initialize', {
      users: users
    });  
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


