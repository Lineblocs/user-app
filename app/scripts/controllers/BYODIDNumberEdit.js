'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BYODIDNumberEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit DID Number");
  $scope.flows = [];
  $scope.number = null;
  $scope.submit = function(number) {
    var params = {};
    params['number'] = $scope.number.number;
    var toastPos = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    var toastPosStr = Object.keys(toastPos)
      .filter(function(pos) { return toastPos[pos]; })
      .join(' ');
    console.log("toastPosStr", toastPosStr);
      $shared.isCreateLoading = true;
    Backend.post("/byo/did/updateNumber/" + $stateParams['numberId'], params).then(function() {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('DIDNumber updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('byo-did-numbers', {});
      $shared.endIsCreateLoading();
    });
  }
  $shared.isLoading = true;
  Backend.get("/byo/did/numberData/" + $stateParams['numberId']).then(function(res) {
    $scope.number = res.data;
    $shared.endIsLoading();
  });
});

