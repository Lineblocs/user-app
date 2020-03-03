'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CallViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, $shared) {
	  $shared.updateTitle("Call View");
  $scope.call = [];
  $scope.load = function() {
    $shared.isLoading =true;
    Backend.get("/call/callData/" + $stateParams['callId']).then(function(res) {
      console.log("call is ", res.data);
      $shared.isLoading =false;
      var call = res.data;
      call.recordings = call.recordings.map(function(obj) {
        obj['uri'] = $sce.trustAsResourceUrl(obj['uri']);
        return obj;
      });
      $scope.call = call;
    })
  }
  $scope.load();
});

