(function(){
'use strict';

var asApp = angular.module('asApp');
asApp.controller('roomsCtrl', ['$scope', '$routeParams', 'GamesRscSrv', roomsCtrl]);
function roomsCtrl($scope, $routeParams, GamesRscSrv){

	GamesRscSrv.getRooms($routeParams.game).then(function(rooms){
		$scope.rooms = rooms;
   	});


}
})();