'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('NotFoundCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $window, Idle) {
	  $shared.updateTitle("404 Not Found");
	  $scope.goBack = function() {
         $window.history.back();
	  }
  });
