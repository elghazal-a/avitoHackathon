var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var express = require('express');
var router = express.Router();

/*
POST a message 
we need user1Id, user2Id and msg
*/
router.post('/', function(req, res) {
  Chat.saveMsg({
  	from: req.body.from,
  	to: req.body.to,
  	msg: req.body.msg
  }, function(err){
  	if(err){
  		console.error(err);
  		return res.sendStatus(500);
  	}
  	res.sendStatus(201);
  })
});

module.exports = router;
