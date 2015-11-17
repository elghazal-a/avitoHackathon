(function(){


'use strict';

var avitoApp = angular.module('avitoApp', ['ngRoute', 
  'SafeApply'
  ]);


avitoApp.config(['$routeProvider', '$locationProvider', '$httpProvider', 
  function($routeProvider, $locationProvider, $httpProvider) {

  var checkLoggedin = function($rootScope, $window, $q, $location){
    if(!$rootScope.me){
      if(!$window.sessionStorage.userid){
        $location.path('/');
      }
      else{
        $rootScope.me = {
          userid: $window.sessionStorage.userid,
          username: $window.sessionStorage.username,
        }
      }
    }
  }

  $routeProvider.when('/', {
    templateUrl: 'partials/login',
    controller: 'loginCtrl'
  });
  $routeProvider.when('/chat', {
    templateUrl: 'partials/chat',
    controller: 'chatCtrl',
    resolve: {
      loggedin: checkLoggedin  
    }
  });
  $routeProvider.otherwise({
    redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);


})();
