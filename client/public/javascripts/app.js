(function(){


'use strict';

var avitoApp = angular.module('avitoApp', ['ngRoute', 
  'SafeApply'
  ]);


avitoApp.config(['$routeProvider', '$locationProvider', '$httpProvider', 
  function($routeProvider, $locationProvider, $httpProvider) {

  $routeProvider.when('/', {
    templateUrl: 'partials/index',
    controller: 'chatCtrl'
  });
  $routeProvider.otherwise({
    redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);


})();
