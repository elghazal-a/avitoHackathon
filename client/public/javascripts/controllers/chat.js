(function(){
'use strict';

var avitoApp = angular.module('avitoApp');

avitoApp.controller('chatCtrl', ['$scope', 
	'$rootScope', 
	'$http',
	'socketService',
	chatCtrl]);

function chatCtrl($scope, $rootScope, $http, socketService){
	// Handle socket connexion
	$scope.me = $rootScope.me;

	var mySocket = new socketService($scope, $scope.me.userid);
	mySocket.connectSocket();
	$scope.$on('$destroy', function(){
		mySocket.disconnectSocket();
	});
	$scope.users = [];
	$scope.userSearch = null;
	$scope.chattingWith = null;
	$scope.msgs = [
	{
		msg: 'Hi Vincent, how are you? How is the project coming along?',
		useridFrom: $scope.me.userid
	},
	{
		msg: 'Are we meeting today? Project has been already finished and I have results to show you.',
		useridFrom: "xxxxxxxxxx"
	}
	];

	$scope.searchUser = function(username){
		$http.get('http://user.avito.local/users/username/' + username).
		success(function(data, status, headers, config){
			$scope.userSearch = data;
		}).
		error(function(data, status, headers, config){
			alert('Please enter a valid username');
		});
	}

	$scope.chatWith = function(user){
		$scope.chattingWith = user;
		//Fetch messages from local db
		//Fetch messages from real db
		
	}
	/*
	* Events
	*/

	var user = {
		id: 1,
		username: 'ahmed',
		online: false,
		socketId: ''

	}
	mySocket.on('chat:initialize', function(data){
		console.log($scope.users);
		$scope.users = data.users;
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