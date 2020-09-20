'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CallViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, $shared, $mdToast) {
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
  $scope.saveCall = function() {
    var data = {
      notes: $scope.call.notes
    };
    Backend.post("/call/updateCall/" + $stateParams['callId'], data).then(function(res) {
      console.log("call is ", res.data);
        $mdToast.show(
          $mdToast.simple()
            .textContent('Call updated..')
            .position('top right')
            .hideDelay(3000)
        );
        $state.go('calls', {});
    })

  }
  $scope.load();
});

