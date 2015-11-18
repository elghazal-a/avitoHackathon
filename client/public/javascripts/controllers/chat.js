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
			from: 'userid from where the msg comes'
		}
	*/
	$scope.msgs = [];

	$scope.searchUser = function(username){
		$http.get('http://user.avito.local/users/username/' + username).
		success(function(data, status, headers, config){
			$scope.userSearch = data;
		}).
		error(function(data, status, headers, config){
			alert('User not found');
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
		$http.get('http://msg.avito.local/msgs/' + $scope.me.userid + '/' + $scope.chattingWith.userid).
		success(function(data, status, headers, config){
			$scope.msgs = data;
		}).
		error(function(data, status, headers, config){
			alert('Error fetching the conversation');
		});
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
				from: data.from
			});

		}
		//Marq the msg as delivred
		// mySocket.emit('msg:delivred', {
		// 	chattingWith: $scope.chattingWith.userid
		// });
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
			from: $scope.me.userid,
			date: new Date()
		});
		$scope.newMsg = "";
	};
}


})();