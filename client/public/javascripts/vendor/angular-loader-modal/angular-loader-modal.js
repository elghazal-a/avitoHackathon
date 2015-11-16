/***********************************************************************************************************************
* Instructions:
*     1. Inject the "loader-modal" into your project.
*     2. Add an element or attribute with "loader" i.e. <div loader></div> preferably at the bottom of your body in HTML.
*     3. You can then use the loader by calling loaderModalAPI.toggle(), loaderModalAPI.show() or loaderModalAPI.hide()
*        anywhere in your application.
*
* Below is an example of how to use the loader modal in your application. This method automatically shows and hides the
* loader upon switching routes (template views).
*
* app.run(['$rootScope', 'loaderModalAPI', function($rootScope, loaderModalAPI) {
*     $rootScope.$on('$routeChangeStart', function(scope, current, previous) {
*         loaderModalAPI.show();
*     });
*
*     $rootScope.$on('$routeChangeSuccess', function(scope, current, previous) {
*         loaderModalAPI.hide();
*     });
* }]);
*
***********************************************************************************************************************/


var module = angular.module('loader-modal', []);

module.directive('loader', ['loaderModalAPI', function(loaderModalAPI) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div id="angular_loader_modal"><div class="spinner"></div></div>',
        link: function(scope, element, attrs) {
            scope.$parent.$on('loaderModalAPI.updated', function() {
                loaderModalAPI.visible ? element.removeClass('hide') : element.addClass('hide');
            }, true);
        }
    };
}]);

module.factory('loaderModalAPI', ['$rootScope', function($rootScope) {
    var service = {
        visible: false,
        show: function() {
            service.visible = true;
            service.updateDirective();
        },
        hide: function() {
            service.visible = false;
            service.updateDirective();
        },
        toggle: function() {
            service.visible = !service.visible;
            service.updateDirective();
        },
        updateDirective: function() {
            $rootScope.$broadcast('loaderModalAPI.updated');
        }
    };

    return service;
}]);
