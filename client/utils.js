


exports.normalizeUser = function(me){
	var user = {};
  user.id = me['_id'];
  user.email = me.local.email || 
            me.facebook.email || 
            me.google.email;
  user.name = me.local.name || 
            me.facebook.name || 
            me.google.name;
  user.score = me.score;
  user.jetons = me.jetons;
  user.pointsVip = me.pointsVip;

  if(me.local && me.local.email)
    user.strategy = "local";
  
  else if(me.facebook && me.facebook.id){
    user.strategy = "facebook";
    user.facebookId = me.facebook.id;
  }
  
  else if(me.google && me.google.id){
    user.strategy = "google";
    user.googleId = me.google.id;
  }

	return user;
}