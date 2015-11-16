(function(){
'use strict'
var asApp = angular.module('asApp');

asApp.directive('msgChat',[ 
	function () {
	return{
		restrict: 'AE',
		scope: {
			msg: '='
		},
		link: function(scope, element, attrs, controller){
			angular.element(element).html(scope.markup);
		},
		controller: function($scope){
			$scope.markup = replaceEmoticons($scope.msg);

			function replaceEmoticons(text) {
				var emoticons = {
					':)' : '32 (36).png',
					':(' : '32 (31).png',
					':D' : '32 (38).png',
					':p' : '32 (14).png',
					':o' : '32 (34).png',
					':@' : '32 (10).png'
				}, 
				url = '/images/smiley/32x32/',
				patterns = [],
				metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;

				for (var i in emoticons) {
					if (emoticons.hasOwnProperty(i)){
					  	patterns.push('('+i.replace(metachars, "\\$&")+')');
					}
				}

				return text.replace(new RegExp(patterns.join('|'),'g'), function (match) {
					return typeof emoticons[match] != 'undefined' ?
					    '<img src="'+url+emoticons[match]+'"/>' :
					    match;
				});
			}
		}
	}


  
}]);
})();