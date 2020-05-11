'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BYODIDNumberCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared ) {
	  $shared.updateTitle("Create DIDNumber");
  $scope.values = {
    username: "",
    secret: "",
    tags: [],
    flow_id: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting number form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['number'] = $scope.values.number;
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
      Backend.post("/byo/did/saveNumber", values).then(function() {
       console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created carrier')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('byo-did-numbers', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $shared.endIsLoading();
});

