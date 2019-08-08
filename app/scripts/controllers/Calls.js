'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CallsCtrl', function ($scope, Backend, $location, $state, $mdDialog) {
  $scope.settings = {
    page: 0
  };
  $scope.calls = [];
  $scope.load = function() {
    Backend.get("/call/listCalls", $scope.settings).then(function(res) {
      $scope.calls = res.data.data;
    })
  }
  $scope.viewCall= function(call) {
    $state.go('call-view', {callId: call.id});
  }

  $scope.load();
});

