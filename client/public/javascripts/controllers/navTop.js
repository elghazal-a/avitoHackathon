(function(){
'use strict';

var asApp = angular.module('asApp');
asApp.controller('navTopCtrl', ['$scope', '$rootScope', '$location', 'SessionSrv', 'AvatarBuilder', navTopCtrl]);
function navTopCtrl($scope, $rootScope, $location, SessionSrv, AvatarBuilder){
	var reloadNavTop = function(){
		SessionSrv.isLoggedin().then(function(user){
			$scope.templateUrl = 'components/navTopPrivate';
			$scope.user = user;
			$scope.profileUrl = AvatarBuilder.getProfilePic($scope.user, 200);
		}, function(status){	
			$scope.templateUrl = 'components/navTopPublic';
		});
	};

	reloadNavTop();

	$scope.$on('session-changed', function() {
		reloadNavTop();
	});
	$scope.logout = function(){
		SessionSrv.logout().then(function(){
			$location.url('/');
			$rootScope.$broadcast('session-changed');
			$scope.notify("success", "", "Déconnexion réussie")
		});
	};

}

})();