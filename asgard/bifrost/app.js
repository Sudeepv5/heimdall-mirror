(function(angular){
  'use strict';
  angular.module('heimdall', ['ui.calendar'])
  .run(function($http, $rootScope){
    $http.get('../config.json').then(function(response){
      $rootScope.config = response.data;
    });
  });

})(window.angular); 