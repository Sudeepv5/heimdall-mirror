(function(angular){
    'use strict';
    angular.module('heimdall').controller('CalendarCtrl', ['$scope', CalendarCtrl]);

    function CalendarCtrl($scope){
        $('.calendar').pignoseCalendar({});


        $('.pignose-calendar-top').remove();
        $('.pignose-calendar-week-sun').html('S');
        $('.pignose-calendar-week-mon').html('M');
        $('.pignose-calendar-week-tue').html('T');
        $('.pignose-calendar-week-wed').html('W');
        $('.pignose-calendar-week-thu').html('T');
        $('.pignose-calendar-week-fri').html('F');
        $('.pignose-calendar-week-sat').html('S');
    }

    

})(window.angular);