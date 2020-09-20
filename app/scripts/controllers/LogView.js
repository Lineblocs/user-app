'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('DebuggerLogViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, $shared) {
	  $shared.updateTitle("Log View");
  $scope.log = null;
  $scope.load = function() {
    $shared.isLoading =true;
    Backend.get("/log/logData/" + $stateParams['logId']).then(function(res) {
      console.log("log is ", res.data);
      $shared.isLoading =false;
      var log = res.data;
      $scope.log = log;
    })
  }
  $scope.load();
});

