'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('DebuggerLogViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, SharedPref) {
	  SharedPref.updateTitle("Log View");
  $scope.log = null;
  $scope.load = function() {
    SharedPref.isLoading =true;
    Backend.get("/log/logData/" + $stateParams['logId']).then(function(res) {
      console.log("log is ", res.data);
      SharedPref.isLoading =false;
      var log = res.data;
      $scope.log = log;
    })
  }
  $scope.load();
});

