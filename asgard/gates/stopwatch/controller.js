(function(angular){
  'use strict';
  angular.module('heimdall').controller('StopwatchCtrl',['$scope', '$interval', 'socketio', StopwatchCtrl]);
  
  function StopwatchCtrl($scope, $interval, socketio){
      $scope.stopwatch = {};
      var minutes = 0, seconds = 0, millis = 0;
      var watch = {}, promise;

      watch.tick = function(){
        millis++;
        if(millis >= 10){
          millis = 0;
          seconds++;
        }
        if(seconds >= 60){
          seconds = 0;
          minutes++;
        }
        watch.update();

        //OCD
        if(minutes >= 20){
          watch.stop();
        }
      }

      watch.update = function(){
        $scope.minutes = minutes < 10 ? '0' + minutes: minutes;
        $scope.seconds = seconds < 10 ? '0' + seconds: seconds;
        $scope.millis = millis;
      };

      watch.start = function(){
        watch.tick();
        promise = $interval(watch.tick, 100);
      };

      watch.stop = function(){
        watch.pause();
        minutes = 0;
        seconds = 0;
        millis = 0;
        watch.update();
      };

      watch.pause = function(){
        $interval.cancel(promise);
      };

      socketio.on('open:stopwatch', function(d){
        if($scope.stopwatch.enabled){
          watch.stop();
        }
        $scope.stopwatch.enabled = true;
        $scope.stopwatch.paused = false;
        watch.start();
      });

      socketio.on('poke:stopwatch', function(d){
        if($scope.stopwatch.enabled){
          if($scope.stopwatch.paused){
            //resume intent
            $scope.stopwatch.paused = false;
            watch.start();
          }
          else {
            //pause intent
            $scope.stopwatch.paused = true;
            watch.pause();
          }
        }
      });

      socketio.on('close:stopwatch', function(d){
        if($scope.stopwatch.enabled){
          watch.stop();
          $scope.stopwatch.enabled = false;
        }
      });

  }

})(window.angular);