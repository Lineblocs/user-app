'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('componentCtrl', function ($scope, $interval, $mdToast, $document) {
    $scope.rating1 = 3;
    $scope.rating2 = 2;
    $scope.rating3 = 4;  
    var self = this,  j= 0, counter = 0;
    self.modes = [ ];
    self.activated = true;
    self.determinateValue = 30;
    /**
    * Turn off or on the 5 themed loaders
    */
    self.toggleActivation = function() {
        if ( !self.activated ) self.modes = [ ];
        if (  self.activated ) j = counter = 0;
    };
    // Iterate every 100ms, non-stop
    $interval(function() {
    // Increment the Determinate loader
        self.determinateValue += 1;
        if (self.determinateValue > 100) {
            self.determinateValue = 30;
        }
        // Incrementally start animation the five (5) Indeterminate,
        // themed progress circular bars
        if ( (j < 5) && !self.modes[j] && self.activated ) {
            self.modes[j] = 'indeterminate';
        }
        if ( counter++ % 4 == 0 ) j++;
    }, 100, 0, true);
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.demo = {};
    $scope.toastPosition = angular.extend({},last);
    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };
    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    $scope.showCustomToast = function() {
        $mdToast.show(
            $mdToast.simple()
            .content('Simple Toast!')
            .position($scope.getToastPosition())
            .hideDelay(30000)
            );
    };
    $scope.showSimpleToast = function() {
        $mdToast.show(
            $mdToast.simple()
            .content('Simple Toast!')
            .position($scope.getToastPosition())
            .hideDelay(30000)
            );
    };
    $scope.showActionToast = function() {
        var toast = $mdToast.simple()
        .content('Action Toast!')
        .action('OK')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function(response) {
            if ( response == 'ok' ) {
                alert('You clicked \'OK\'.');
            }
        });
    };
})
.controller('ToastCtrl', function($scope, $mdToast) {
    $scope.closeToast = function() {
        $mdToast.hide();
    };

});