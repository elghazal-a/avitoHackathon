(function(){
'use strict';

var avitoApp = angular.module('avitoApp');

avitoApp.controller('roomCtrl', ['$scope', 
	'$rootScope', 
	'$routeParams', 
	'$location', 
	'socketService', 
	roomCtrl]);

function roomCtrl($scope, $rootScope, $location, socketService){
	// Handle socket connexion
	var	channel = '/';

	var mySocket = new socketService($scope, channel);
	mySocket.connectSocket();

	$scope.$on('$destroy', function(){
		mySocket.disconnectSocket();
	});


	/*
	* Events
	*/

	mySocket.on('chat:initialized', function(data){
	});

	mySocket.on('msg:new', function(msg){
		// msg.date = new Date();
		// $scope.messages.push(msg);
	});
	$scope.sendMsg = function(msgAenvoyer){
		// if(!msgAenvoyer || msgAenvoyer == "")
		// 	return;
		// mySocket.emit('msg:new', msgAenvoyer);
		// $scope.messages.push({
		// 	senderUsername: $scope.user.name,
		// 	msg: msgAenvoyer,
		// 	date: new Date()
		// });
		// $scope.msg = "";
	};
}


})();