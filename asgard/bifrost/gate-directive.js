(function(angular) {
    'use strict';
    angular.module('heimdall').directive('gate', function() {
        return {
            restrict: 'E',
            templateUrl: function(elem, attr) {
                return 'gates/' + attr.name + '/index.html';
                }
        };
    });
    
})(window.angular);                              