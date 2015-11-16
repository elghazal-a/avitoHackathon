(function(){

'use strict';

var asApp = angular.module('asApp');

asApp.filter('eliminateNull', ['_', 
    function(_){
    return function(tab){
        return _.filter(tab, function(player){ return player.id !== null; });
    }
}]);

})();
