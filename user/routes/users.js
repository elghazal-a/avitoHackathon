var express = require('express');
var router = express.Router();
var users = require('./db');
/* GET users listing. */

router.get('/username/:username', function(req, res) {
	for (var i = 0; i < users.length; i++) {
	  	if(users[i].username == req.params.username){
	  		return res.json(users[i]);
	  	}
	}
	res.send(401);
});

router.post('/login', function(req, res) {
	for (var i = 0; i < users.length; i++) {
	  	if(users[i].username == req.body.username){
	  		return res.json(users[i]);
	  	}
	}
	res.send(401);
});

module.exports = router;
