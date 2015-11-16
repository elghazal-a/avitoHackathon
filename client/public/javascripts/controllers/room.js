(function(){
'use strict';

var asApp = angular.module('asApp');

asApp.controller('roomCtrl', ['$scope', 
	'$rootScope', 
	'$routeParams', 
	'$location', 
	'socketService', 
	'loaderModalAPI', 
	'dialogs',
	'AvatarBuilder',
	roomCtrl]);

function roomCtrl($scope, $rootScope, $routeParams, $location, socketService, loaderModalAPI, dialogs, AvatarBuilder){
	// Handle socket connexion

	var gameName = $routeParams.gameName;
	var roomNbr = $routeParams.roomNbr;
	var	channel = '/' + gameName + '/room/' + roomNbr;

	var mySocket = new socketService($scope, channel);
	mySocket.connectSocket();

	$scope.$on('$destroy', function(){
		mySocket.disconnectSocket();
	});

	$scope.gameName = gameName;
	$scope.roomNbr = roomNbr;


	/*
	* Events
	*/

	loaderModalAPI.show();
	mySocket.on('room:initialized', function(data){
		$scope.user = data.user;
		$scope.users = data.room.users;
		$scope.messages = data.room.messages;
		$scope.tables = data.tables;
		deleteUserBySocketID($scope.user.socketID);
		loaderModalAPI.hide();
	});

	$scope.getAvatarUrl = function(user){
		return AvatarBuilder.getProfilePic(user, 40);
	}
	mySocket.on('player:new', function(player){
		$scope.users.push(player);		
	});

	mySocket.on('player:left', function(userSocketID){
		deleteUserBySocketID(userSocketID);
	});


	mySocket.on('table:created', function(table){
		$scope.tables.push(table);
	});
	mySocket.on('table:delete', function(routeTable){
		$scope.tables.forEach(function(table, index){
			if(table.route == route)
				$scope.tables.splice(index, 1);
		});

	});
	$scope.createTable = function(){
        var dlg = dialogs.create('/bootstrap/modalForm','createTableCtrl',{},{key: false,back: 'static'});
        dlg.result.then(function(newTable){
			mySocket.emit('table:create', newTable, function(routeTable){
				if(routeTable){
					$scope.notify("Info", "", "Votre table a été crée");
					$scope.$safeApply($scope, function(){
						$location.path('/play/' + $scope.gameName + '/' + $scope.roomNbr + '/table/' + routeTable);
					});

				}
				else 
					$scope.notify("Error", "", "Une erreur s'est produit");
			});
        },function(){
        });

	};

	var deleteUserBySocketID = function(socketID){
		$scope.users.forEach(function(user, index){
			if(user.socketID == socketID)
				$scope.users.splice(index, 1);
		});
	}

	//Chat
	$scope.chatIsCollapsed = true;
	mySocket.on('msg:new', function(msg){
		msg.date = new Date();
		$scope.messages.push(msg);
	});
	$scope.sendMsg = function(msgAenvoyer){
		if(!msgAenvoyer || msgAenvoyer == "")
			return;
		mySocket.emit('msg:new', msgAenvoyer);
		$scope.messages.push({
			senderUsername: $scope.user.name,
			msg: msgAenvoyer,
			date: new Date()
		});
		$scope.msg = "";
	};
}


asApp.controller('createTableCtrl', ['$scope', '$modalInstance', function($scope,$modalInstance, data){
  $scope.newTable = {};

  $scope.cancel = function(){
    $modalInstance.dismiss('canceled');  
  };
  
  $scope.save = function(){
    $modalInstance.close($scope.newTable);
  };
}]);



})();