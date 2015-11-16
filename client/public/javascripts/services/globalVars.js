(function(){
'use strict'
var asApp = angular.module('asApp');
asApp.factory('GlobalVarsSrv', [function(){
	return{
		baseFrontend	: 'http://asdecartes.local',
		baseBackend		: 'http://backend.asdecartes.local',
		baseGameIO		: 'http://lobbyio.asdecartes.local'
	};
}]);

})();