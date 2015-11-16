(function(){
'use strict'
var asApp = angular.module('asApp');
asApp.factory('GamesRscSrv', ['GlobalVarsSrv', '$q', '$http',
	function(GlobalVarsSrv, $q, $http){
		var baseBackend = GlobalVarsSrv.baseBackend;

		return{
			getGames: function(){
				var deferred = $q.defer();
				$http.get(baseBackend + '/game').
				success(function(data, status){
			      	deferred.resolve(data);
				}).
				error(function(data, status){
			    	deferred.reject(status);
				});
			    return deferred.promise;
			},
			getRooms: function(gameName){
				var deferred = $q.defer();
				$http.get(baseBackend + '/room/' + gameName + '/rooms').
				success(function(data, status){
			      	deferred.resolve(data);
				}).
				error(function(data, status){
			    	deferred.reject(status);
				});
			    return deferred.promise;
			},
		}
}]);

})();