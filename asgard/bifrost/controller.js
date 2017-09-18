(function(angular){
    'use strict';

    angular.module('heimdall').controller("BifrostCtrl", ['$scope', '$http', '$interval', 'socketio', BifrostCtrl]);
    
    function BifrostCtrl($scope, $http, $interval, socketio){
        
        var _this = this;
        $scope.stale = {};
        $scope.stale.weather = 0;
        
        function tick(){
            $scope.date = new moment();
        }

        function minute(){
            $scope.stale.weather++;
        }
        
        _this.run = function(){
            tick()
            $interval(tick, 1000);
            $interval(minute, 60000);
        }
        
        _this.run();
        
        socketio.on('open:bifrost', function(d){
            $scope.online = true;
        })
        socketio.on('close:bifrost', function(d){
            $scope.online = false;
        })
    }


})(window.angular);