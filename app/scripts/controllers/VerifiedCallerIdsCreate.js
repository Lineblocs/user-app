'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('VerifiedCallerIdsCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared ) {
	  $shared.updateTitle("Verified Caller IDs");
   $scope.values = {
    secret: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
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
      values['caller_id'] = $scope.values.caller_id;
      values['secret'] = $scope.values.secret;
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
      Backend.post("/extension/saveExtension", values).then(function() {
       console.log("updated extension..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created extension')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('extensions', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $timeout(function() {
    $shared.endIsLoading();
  }, 0);
});

