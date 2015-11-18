var express = require('express');
var router = express.Router();
var users = require('./db');

//Get by username (should've used querystring but I'm lazy)
router.get('/username/:username', function(req, res) {
	for (var i = 0; i < users.length; i++) {
	  	if(users[i].username == req.params.username){
	  		return res.json(users[i]);
	  	}
	}
	res.send(404);
});

//Login simulation
router.post('/login', function(req, res) {
	for (var i = 0; i < users.length; i++) {
	  	if(users[i].username == req.body.username){
	  		return res.json(users[i]);
	  	}
	}
	res.send(401);
});

//Set On/off (should've implemented general PATCH to make partial update)
router.patch('/online', function(req, res) {
	for (var i = 0; i < users.length; i++) {
	  	if(users[i].userid == req.body.userid){
	  		users[i].online = req.body.online;
	  		return res.sendStatus(200);
	  	}
	}
	res.sendStatus(404);
});

//helper to get users by ids
router.post('/ids-to-users', function(req, res) {
	console.log(req.body.users);
	req.body.users.forEach(function(user, i){
		for (var i = 0; i < users.length; i++) {
		  	if(users[i].userid == user.userid){
		  		user.username = users[i].username;
		  		user.online = users[i].online;
		  	}
		}
		
	});
	res.json(req.body.users);
});

module.exports = router;
