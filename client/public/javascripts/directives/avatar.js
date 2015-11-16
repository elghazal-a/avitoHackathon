(function(){
'use strict'
var asApp = angular.module('asApp');

asApp.directive('avatar',[function () {
	return{
		restrict: 'E',
		replace: true,
		template: "<img class='card' ng-src='{{src}}'>",
		scope: {
			width: '=',
			height: '='
		},
		link: function(scope, element, attrs, controller){
			scope.src = "/images/ronda/cards.gif";

		}
	}


  
}]);
})();