(function(){

'use strict';

var asApp = angular.module('asApp');

asApp.filter('privateOrPublicTable', function(){
    return function(bool){
        return (bool) ? "Privé" : "Public";
    }
});

})();
