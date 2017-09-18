(function(angular){
    'use strict';
    angular.module('heimdall').controller('WeatherCtrl', ['$scope', '$rootScope', '$http', '$interval', WeatherCtrl]);

    function WeatherCtrl($scope, $rootScope, $http, $interval){
        $scope.weather = {}
        var forecast = {};
        var config = $rootScope.config;

        forecast.callThor = function(){
            $http.get('weather').then(forecast.showThunders,forecast.lazyHammer);
            $scope.stale.weather = 0;
        }
        
        forecast.showThunders = function(response){
            var dump = response;
            if(dump == null || dump.data == null){
                forecast.lazyHammer();
            }
            $scope.weather.now = forecast.now(dump.data);
            $scope.weather.hourly = forecast.hourly(dump.data);
            $scope.weather.daily = forecast.daily(dump.data);
        }
        
        forecast.now = function(weather){
            if(weather.currently == null)
                forecast.lazyHammer();
            return pristine(weather.currently);
        }
        
        forecast.hourly = function(weather){
            if(weather.hourly == null)
                forecast.lazyHammer();
            weather.hourly.data = weather.hourly.data.slice(1,6);
            
            return weather.hourly.data.map(pristine);
        }

        forecast.daily = function(weather){
            if(weather.daily == null)
                forecast.lazyHammer();
            return weather.daily.data.map(pristine);
        }
        
        function pristine(item){
            return {
                time: item.temperature ? moment.unix(item.time).format('hA') : moment.unix(item.time).format('ddd'),
                summary: item.summary,
                icon: item.icon,
                temperature: item.temperature ? parseFloat(item.temperature).toFixed(0) : null,
                temperatureMin: item.temperature ? null : parseFloat(item.temperatureMin).toFixed(0),
                temperatureMax: item.temperature ? null : parseFloat(item.temperatureMax).toFixed(0),
            };
        }        
        
        forecast.lazyHammer = function(dump){
            $scope.weather.error = dump == null ? "Hulk Smash! No error data survived!" : "Puny error: " + dump;
        }

        forecast.refresh = function(){
            forecast.callThor();
            $interval(forecast.callThor, config.weather.interval * 60000)
        }

        forecast.refresh();
    }

})(window.angular);