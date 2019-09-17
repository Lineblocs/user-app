'use strict';

/**
* @ngdoc directive
* @name joggingTrackerApp.directive:smartButton
* @description
* # smartButton
* # This button replaces the existing Bootstrap button with a nice transtion to show progress.
* # It also shows success or failure with check and cross FontAwesome icons
*/


/**
* A simple service to provide incremental values at every fixed interval
*/
angular
    .module('MaterialApp')
    .factory('RandomIncremental', function(){
        return function(){
            var _callbacks = [];
            var _currentVal = 20;
            var _interval = 600;
            var timeoutId = null;
            this.start = function(){
                timeoutId = setInterval(this.randomInrement, _interval);
            }
            this.randomInrement = function(){
                _currentVal += (100 - _currentVal) * Math.random() * 0.6;
                angular.forEach(_callbacks, function(fnCallback){
                    fnCallback(_currentVal);
                });
            }
            this.onUpdate = function(callback) {
                _callbacks.push(callback);
            }
            this.stop = function() {
                clearInterval(timeoutId);
            }
            this.reset = function() {
                _currentVal = 20;
            }
        };
    })
    .directive('smartButton', function ($animate) {
        return {
            templateUrl: 'scripts/directives/smart-button/smart-button.html?v='+window.app_version,
            transclude: true,
            replace: true,
            restrict: 'E',
            scope: {
                loading: '=?',
                success: '=?'
            },
            controller: function($scope, RandomIncremental, $timeout, $animate){
                if(typeof $scope.loading == 'undefined')
                    $scope.loading = false;
                if(typeof $scope.success == 'undefined') {
                    $scope.success = true;
                }
                $scope.progressValue = 0;
                $scope._loading = $scope.loading;
                var randomer = null;
                $scope.$watch('loading', function(newVal, oldVal){
                    if(newVal == oldVal)
                        return;
                    if(!randomer) {
                        randomer = new RandomIncremental;
                        randomer.onUpdate(function(randomValue){
                            $scope.$apply(function(){
                                $scope.progressValue = randomValue;
                            })
                        })
                    }
                    if(newVal) {
                        $scope._loading = true;
                        randomer.reset();
                        randomer.start();
                    } else {
                        randomer.stop();
                        $scope.progressValue = 100;
                        $scope._loading = false;
                    }
                });
            },
            link: function postLink(scope, element, attrs) {
                scope.$watch('_loading', function(loading) {
                    if(!loading) {
                        $animate.removeClass(element, 'loading', function(){
                            scope.progressValue = 0;
                            scope.$apply();
                        });
                    } else {
                        $animate.addClass(element, 'loading');
                    }
                });
            }
        };
    });
    /**
    * The <smart-button> directive takes two two-way bound boolean parameters
    * 1. loading: to toggle showing or hiding of the progress bar
    * 2. success: to show the end-result, if it's true, it shows the check mark else it shows the cross mark
    */

