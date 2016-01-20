var app = angular.module('myApp', ['oi.select']);
app.config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
app.filter('replace', function(){
  return function(text) {
       return text.replace(/&quot;/g,"'").replace(/&#39;/g,'"');
      };
});