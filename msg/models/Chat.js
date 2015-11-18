var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

 
var ChatSchema = new Schema(
{
  /*
  Order doesn't matter
  buyer and seller play symetric role
  */
  owners: [String],
  delivred: {type: Boolean, default: false},
  msgs:
  [
    {
      from: String,
      msg: String,
      date: { type: Date, default: Date.now }
    }
  ]
});


ChatSchema.statics.saveMsg = function(data, cb){
  /*
  data = {from, to, msg}
  */
  this.update({$and: [{
    owners: {$in: [data.from]}
  }, {
    owners: {$in: [data.to]}
  }]}, {
    owners: [data.from, data.to],
    '$push': {msgs: {
      from: data.from,  
      msg: data.msg  
    }},
    delivred: false
  }, {upsert: true}, 
  cb);
};

// ChatSchema.statics.marqConversationAsRead = function(userId, friendId, cb){
//   // si le dernier message m'est déstiné => make delivred = true
//   this.update({
//     owners: {$in: [userId, friendId]},
//     delivred: false,
//     'bucket_msg.0.to': userId
//   }, {
//     delivred: true
//   }, cb);
// };

ChatSchema.statics.getConversations = function(userid, cb){
  this.find({owners: {$in: [userid]}}, {
    msgs: {$slice: -1}, '_id': 0
  }, cb);
};

ChatSchema.statics.getHistory = function(userid1, userid2, cb){
  this.findOne({$and: [{
    owners: {$in: [userid1]}
  }, {
    owners: {$in: [userid2]}
  }]}, cb);
};


module.exports = mongoose.model('Chat', ChatSchema);