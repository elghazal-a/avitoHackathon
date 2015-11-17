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

	/*
		{
			msg: 'the message',
			useridFrom: 'userid from where the msg comes'
		}
	*/
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
		/*
			Fetch messages from local db 
			skip it now until the next iteration
		*/
		/*
			Fetch messages from real db
		*/
	}

	/*
	* Events
	*/

	mySocket.on('chat:initialize', function(data){
		$scope.users = data.users;
	});

	mySocket.on('msg:new', function(data){
		if($scope.chattingWith && $scope.chattingWith.userid == data.from){
			$scope.msgs.push({
				msg: data.msg,
				useridFrom: data.from
			});
		}
	});
	$scope.sendMsg = function(newMsg){
		if(!newMsg || newMsg == "")
			return;
		mySocket.emit('msg:new', {
			msg: newMsg,
			to: $scope.chattingWith.userid
		});
		$scope.msgs.push({
			msg: newMsg,
			useridFrom: $scope.me.userid,
			date: new Date()
		});
		$scope.newMsg = "";
	};
}


})();