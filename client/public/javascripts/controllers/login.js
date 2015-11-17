(function(){
'use strict';

var avitoApp = angular.module('avitoApp');

avitoApp.controller('loginCtrl', ['$scope',
	'$rootScope',
	'$http',
	'$location',
	'$window',
	loginCtrl]);

function loginCtrl($scope, $rootScope, $http, $location, $window){
	$scope.username = 'ahmed';
	$scope.login = function(username){
		$http.post('http://user.avito.local/users/login', {
	        username: username
		}).
		success(function(data, status, headers, config){
			$rootScope.me = data;
			$window.sessionStorage.userid = data.userid;
			$window.sessionStorage.username = data.username;
			$location.path('/chat');
		}).
		error(function(data, status, headers, config){
			alert('Please enter a valid username');
		});
	};
}
})();