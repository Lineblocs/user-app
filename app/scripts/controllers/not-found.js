'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('NotFoundCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $window, Idle) {
	  $shared.updateTitle("404 Not Found");
	  $scope.goBack = function() {
         $window.history.back();
	  }
  });
