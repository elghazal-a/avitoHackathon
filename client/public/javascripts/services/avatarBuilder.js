(function(){
'use strict'
var asApp = angular.module('asApp');
asApp.factory('AvatarBuilder', ['GravatarBuilder', 
	function(GravatarBuilder){
	return{
		getProfilePic: function(user, size){
			switch(user.strategy){
				case 'local':
					return GravatarBuilder.buildGravaterUrl(user.email, size);
					break;
				case 'facebook':
					return 'http://graph.facebook.com/' + user.facebookId + '/picture?height=' + size + '&type=normal&width=' + size;
					break;
				case 'google':
					return '';
					break;

				default:
					return '/images/ronda/img-noir.png';
				break;
			}
		}
	}
}]);

})();