'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CallViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams) {
  $scope.call = [];
  $scope.load = function() {
    Backend.get("/call/callData/" + $stateParams['callId']).then(function(res) {
      $scope.call = res.data;
    })
  }
  $scope.load();
});

