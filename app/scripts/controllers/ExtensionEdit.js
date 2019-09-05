'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionEditCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $stateParams, SharedPref) {
	  SharedPref.updateTitle("Edit Extension");
  $scope.values = {
    username: "",
    secret: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.load = function() {
    Backend.get("/extension/extensionData/" + $stateParams['extensionId']).then(function(res) {
      $scope.extension = res.data;
      $scope.values = angular.copy( $scope.extension );
    });
  }
  $scope.generateSecret = function() {
    $scope.values.secret = generatePassword();
  }
  $scope.showSecret = function() {
    $scope.ui.showSecret = true;
  }
  $scope.hideSecret = function() {
    $scope.ui.showSecret = false;
  }
  $scope.submit = function(form) {
    console.log("submitting extension form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['username'] = $scope.values.username;
      values['secret'] = $scope.values.secret;
      values['caller_id'] = $scope.values.caller_id;
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
      SharedPref.isCreateLoading = true;
      Backend.post("/extension/updateExtension/" + $stateParams['extensionId'], values).then(function() {
       console.log("updated extension..");
      SharedPref.isCreateLoading = false;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Updated extension')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('extensions', {});
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $scope.load();
});


