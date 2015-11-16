(function(){

'use strict';

var asApp = angular.module('asApp');

asApp.filter('isoDateToDate', function(){
    return function(date){
    	var time = new Date(date);
        return time;
    }
});

})();
