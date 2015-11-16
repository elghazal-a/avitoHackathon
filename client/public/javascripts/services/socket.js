(function(){
'use strict'
var asApp = angular.module('asApp');


asApp.factory('socketService',[
  '$safeApply', 
  '$window', 
  'GlobalVarsSrv', 
  function ($safeApply, $window, GlobalVarsSrv) {
  
  return function($scope, channel){
    this.base = GlobalVarsSrv.baseGameIO;
    this.channel = channel;
    this.url = this.base + this.channel;
    this.socket = {};
 
    this.connectSocket = function(){
      this.socket = io(this.url, {
        forceNew: true,
        query: 'token=' + $window.sessionStorage.token
      });
    };
    this.disconnectSocket = function(){
      this.socket.removeAllListeners();
      this.socket.disconnect();
      delete this.socket;
    };

    this.on = function (eventName, callback) {
      var that = this;
      this.socket.on(eventName, function () {  
        var args = arguments;
        $safeApply($scope, function () {
          callback.apply(that.socket, args);
        });
      });
    };
    this.emit = function (eventName, data, callback) {
      var that = this;
      this.socket.emit(eventName, data, function () {
        var args = arguments;
        $safeApply($scope, function () {
          if (callback) {
            callback.apply(that.socket, args);
          }
        });
      })
    };
    
  };
}]);


})();


