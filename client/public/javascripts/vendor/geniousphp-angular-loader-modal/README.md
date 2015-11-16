angular-loader-modal
====================

Creates a directive modal with a loading animation that can be toggled using it's angular service.


Instructions
---
1. Inject the "loader-modal" into your project.
2. Add an element or attribute with "loader" i.e. <div loader></div> preferably at the bottom of your body in HTML.
3. You can then use the loader by calling loaderModalAPI.toggle(), loaderModalAPI.show() or loaderModalAPI.hide() anywhere in your application.

Below is an example of how to use the loader modal in your application. This method automatically shows and hides the
loader upon switching routes (template views).

```javascript
app.run(['$rootScope', 'loaderModalAPI', function($rootScope, loaderModalAPI) {
 $rootScope.$on('$routeChangeStart', function(scope, current, previous) {
     loaderModalAPI.show();
 });

 $rootScope.$on('$routeChangeSuccess', function(scope, current, previous) {
     loaderModalAPI.hide();
 });
}]);
```
