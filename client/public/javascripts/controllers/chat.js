(function(){
'use strict';

var avitoApp = angular.module('avitoApp');

avitoApp.controller('chatCtrl', ['$scope', 
	'$rootScope', 
	'socketService', 
	chatCtrl]);

function chatCtrl($scope, $rootScope, socketService){
	// Handle socket connexion

	var mySocket = new socketService($scope, '1');
	mySocket.connectSocket();

	$scope.$on('$destroy', function(){
		mySocket.disconnectSocket();
	});

	/*
	* Events
	*/

	var user = {
		id: 1,
		username: 'ahmed',
		online: false,
		socketId: ''

	}
	mySocket.on('chat:initialized', function(data){
	});

	mySocket.on('msg:new', function(msg){
		// msg.date = new Date();
		// $scope.messages.push(msg);
	});
	$scope.sendMsg = function(msgAenvoyer){
		if(!msgAenvoyer || msgAenvoyer == "")
			return;
		mySocket.emit('msg:new', {
			msg: msgAenvoyer,
			to: toUserId
		});
		$scope.messages.push({
			senderUsername: $scope.user.name,
			msg: msgAenvoyer,
			date: new Date()
		});
		$scope.msg = "";
	};
}


})();