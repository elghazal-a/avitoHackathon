(function(){
'use strict'
var asApp = angular.module('asApp');
asApp.factory('SessionSrv', ['GlobalVarsSrv', '$window', '$q', '$http', 
	function(GlobalVarsSrv, $window, $q, $http){
		var baseBackend = GlobalVarsSrv.baseBackend;
		return{
			authenticate: function(email, password){
				var deferred = $q.defer();
				$http.post(baseBackend + '/auth/login', {
			        email: email,
		            password: password}).
				success(function(data, status, headers, config){
			      	deferred.resolve(data);
				}).
				error(function(data, status, headers, config){
			    	deferred.reject(status);
				});
			    return deferred.promise;
			},
			signUp: function(email, name, password, username){
				var deferred = $q.defer();

				$http.post(baseBackend + '/auth/signup', {
		            email: email,
			        name: name,
		            password: password}).
				success(function(data, status){
			      	deferred.resolve();
				}).
				error(function(data, status){
			    	deferred.reject(status);
				});
			    return deferred.promise;
			},
	        facebookLogin: function() {
	            var url = baseBackend + '/auth/facebook',
	                width = 800,
	                height = 500,
	                top = (window.outerHeight - height) / 2,
	                left = (window.outerWidth - width) / 2;
	            $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=1,top=' + top + ',left=' + left);
	        },
	        twitterLogin: function() {
	            var url = baseBackend + '/auth/twitter',
	                width = 800,
	                height = 500,
	                top = (window.outerHeight - height) / 2,
	                left = (window.outerWidth - width) / 2;
	            $window.open(url, 'twitter_login', 'width=' + width + ',height=' + height + ',scrollbars=1,top=' + top + ',left=' + left);
	        },
	        googleLogin: function() {
	            var url = baseBackend + '/auth/google',
	                width = 800,
	                height = 500,
	                top = (window.outerHeight - height) / 2,
	                left = (window.outerWidth - width) / 2;
	            $window.open(url, 'google_login', 'width=' + width + ',height=' + height + ',scrollbars=1,top=' + top + ',left=' + left);
	        },
	        authSuccess: function(token){
				$window.sessionStorage.token = token;
	        },
	        authFailed: function(){
	        	delete $window.sessionStorage.token;
	        },
	        signUpSuccess: function(){
	        },
	        signUpFailed: function(){
	        },
			isLoggedin: function(){
			    var deferred = $q.defer();
			    $http.get(baseBackend + '/auth/loggedin')
			    .success(function(user, status, headers, config){
			      	deferred.resolve(user);
			    })
			    .error(function(data, status, headers, config){
			      	// Not Authenticated
			    	deferred.reject(status);
			    });
			    return deferred.promise;
	  		},
	  		logout: function(){
	  			var deferred = $q.defer();
			    $http.get(baseBackend + '/auth/logout')
			    .success(function(){
			    	delete $window.sessionStorage.token;
			      	deferred.resolve();
			    })
			    .error(function(data, status){
			    	deferred.reject(status);
			    });

			    return deferred.promise;
	  		}
		}
}]);

})();