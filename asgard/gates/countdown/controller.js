(function(angular){
  'use strict';
  angular.module('heimdall').controller('CountdownCtrl',['$scope', '$rootScope', '$interval', 'socketio', CountdownCtrl]);
  
  function CountdownCtrl($scope, $rootScope, $interval, socketio){
      $scope.countdown = {};
      var minutes = 0, seconds = 0, millis = 0, counter = 0;
      var countdown = {}, promise;
      var config = $rootScope.config.countdown;

      countdown.tick = function(){
        var t = --counter;
        minutes = Math.floor(t/600);
        t -= minutes * 600;
        seconds = Math.floor(t/10);
        t -= seconds * 10
        millis = t;
        countdown.update();
      }

      countdown.update = function(){
        $scope.minutes = minutes < 10 ? '0' + minutes: minutes;
        $scope.seconds = seconds < 10 ? '0' + seconds: seconds;
        $scope.millis = millis;
      }


      countdown.init = function(millis, message) {
        if(millis < 0) {
          return;
        }
        counter = millis;
        return countdown.count(message);
      }

      countdown.count = function(message) {
        $scope.countdown.message = message;
        promise = $interval(countdown.tick, 100, counter);
        return promise;
      }

      countdown.pause = function(message){
        $scope.countdown.message = message;
        if(angular.isDefined(promise)) {
          $interval.cancel(promise);
          promise = undefined;
        }
      }

      countdown.abandon = function(){
        countdown.pause("All Done!");
        minutes = 0;
        seconds = 0;
        millis = 0;
        counter = 0;
        countdown.update();
      }

      countdown.spawn = function(){
        var s = config.spawn;
        minutes = 0;
        seconds = 0;
        millis = 0;
        counter = 0;
        countdown.update();
        var spawning = $interval(function(t){
          $scope.countdown.message = "Starting in " + (s-t);
        }, 1000, s);
        return spawning;
      }

      //only in mins
      socketio.on('open:countdown', function(data){
        if($scope.countdown.enabled){
          countdown.abandon();
        }
        $scope.countdown.enabled = true;
        countdown.spawn().then(function(){
          //init ms
          countdown.init(data.data * config.minute, "Lets-A-Go!").then(countdown.abandon);
        });
      });

      socketio.on('poke:countdown', function(data){
        if($scope.countdown.enabled){
          if($scope.countdown.paused){//resume intent
            $scope.countdown.paused = false;
            countdown.init(counter, "Going strong!").then(countdown.abandon);
          }
          else {//pause intent
            $scope.countdown.paused = true;
            countdown.pause("Buffering!");
          }
        }
      });

      socketio.on('close:countdown', function(data){
        countdown.abandon();
        $scope.countdown.enabled = false;
      });


      socketio.on('open:ragnarok', function(d){
        $scope.countdown.enabled = true;
        countdown.spawn().then(function(){
          countdown.ragnarok();
        })
      });

      socketio.on('close:ragnarok', function(d){
        countdown.abandon();
        $scope.countdown.enabled = false;
      });

      countdown.ragnarok = function(){
        countdown.init(config.work, "1. Mjolnir!").then(function(){
          countdown.init(config.rest,"Rest").then(function(){
            countdown.init(config.work, "2. Thunders!").then(function(){
              countdown.init(config.rest,"Rest").then(function(){
                countdown.init(config.work, "3. Hulk Smash!").then(function(){
                  countdown.init(config.rest,"Rest").then(function(){
                    countdown.init(config.work, "4. Puny God!").then(function(){
                      countdown.init(config.rest,"Rest").then(function(){
                        $scope.countdown.message = "Broken Hammer";
                      })
                    })
                  })
                })
              })
            })
          })
        })
      }






  }

})(window.angular);