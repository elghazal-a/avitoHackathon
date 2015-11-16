(function(){
'use strict';

var asApp = angular.module('asApp');
asApp.controller('playCtrl', ['$scope', 'GamesRscSrv', playCtrl]);
function playCtrl($scope, GamesRscSrv){
	GamesRscSrv.getGames().then(function(games){
		$scope.games = games;
   	});


}
})();