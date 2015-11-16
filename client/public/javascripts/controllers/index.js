(function(){
'use strict';

var asApp = angular.module('asApp');
asApp.controller('indexCtrl', ['$scope', 
	'$rootScope', 
	'$location', 
	'SessionSrv', 
	'$window', 
	'$timeout', 
	indexCtrl]);


function indexCtrl($scope, $rootScope, $location, SessionSrv, $window, $timeout){
	$scope.user = {};
	$scope.newUser = {};
	
	$scope.authenticate = function(user){
		SessionSrv.authenticate(user.email, user.password).then(function(data){
			SessionSrv.authSuccess(data.token);
			$scope.user = {};
			$rootScope.$broadcast('session-changed');
			$scope.notify("success", "", "Connexion réussie");
		}, function(status){	
			SessionSrv.authFailed();
			$scope.notify("error", "", "Erreur d'authentification");
		});
	};

	$scope.signUp = function(user){
		SessionSrv.signUp(user.email, user.username, user.password).then(function(){
			SessionSrv.signUpSuccess();
			$scope.newUser = {};
			$rootScope.$broadcast('session-changed');
			$scope.notify("success", "", "Inscription réussie");
		}, function(status){
			SessionSrv.signUpFailed();
			$scope.notify("error", "", "Erreur lors de l'inscription");
		});
	};

	$scope.facebookLogin = function(){
		SessionSrv.facebookLogin();
	}
	$scope.twitterLogin = function(){
		SessionSrv.twitterLogin();
	}
	$scope.googleLogin = function(){
		SessionSrv.googleLogin();
	}


}

})();