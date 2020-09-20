'use strict';

angular.module('Lineblocs')
.directive('stats',function(){
    return {
        templateUrl:'scripts/directives/stats/stats.html?v='+window.app_version,
        restrict: 'E',
        replace: true,
        scope: {
            'options': '=',
            'percent': '@',
            'value': '@',
            'header': '@',
            'arrow': '@',
            'footer': '@'
        }
    }
});


