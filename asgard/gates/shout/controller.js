(function(angular){
  'use strict';
  angular.module('heimdall').controller('ShoutCtrl',function($scope){
      var msgs = [];
      $scope.message = msgs.join("\n");

  });

})(window.angular);