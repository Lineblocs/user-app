'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionEditCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $stateParams, $shared, $q) {
	  $shared.updateTitle("Edit Extension");
  $scope.values = {
    username: "",
    secret: "",
    flow_id: "",
    tags: []
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0,
    secretError: ""
  }
  $scope.triedSubmit = false;
  $scope.load = function() {
  $shared.isLoading = true;
   $q.all([
      Backend.get("/flow/list?category=extension"),
      Backend.get("/extension/" + $stateParams['extensionId'])
   ]).then(function(res) {
      $scope.flows= res[0].data.data;
      $scope.extension = res[1].data;
      $scope.values = angular.copy( $scope.extension );
      $shared.endIsLoading();
    });
  }

  $scope.generateSecret = function() {
    Backend.get("/generateSecurePassword").then(function(res) {
    $scope.values.secret = res.data.password;
    });
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
      Backend.post("/verifyPasswordStrength", {
          'password': $scope.values.secret
      }).then(function(res) {
        if ( !res.data.success ) {
          $scope.ui.secretError = res.data.validationError;
          console.log($scope.ui);
          return;
        }
        var values = {};
        values['username'] = $scope.values.username;
        values['secret'] = $scope.values.secret;
        values['caller_id'] = $scope.values.caller_id;
        values['flow_id'] = $scope.values.flow_id;
        values['tags'] = $scope.values.tags;
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
        Backend.post("/extension/" + $stateParams['extensionId'], values).then(function() {
        console.log("updated extension..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Updated extension')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('extensions', {});
        $shared.endIsCreateLoading();
        });
      });
    }
  }
  $scope.keyupSecret = function() {
    console.log("keyupSecret called..");
    var secret = $scope.values.secret;
    console.log("secret is ", secret);
    if (secret.length < 8) {
      $scope.ui.secretError = "Password must be 8 or more characters.";
    } else if (!secret.match(/[0-9]+/g)) {
      $scope.ui.secretError = "Password include a number";
    } else if (!secret.match(/[A-Z]+/g)) {
      $scope.ui.secretError = "Password include an uppercase letter";
    } else if (!secret.match(/[a-z]+/g)) {
      $scope.ui.secretError = "Password include an lowercase letter";
    } else if (!secret.match(/[\'^£$%&*()}{@#~?><>,|=_+¬-]/g)) {
      $scope.ui.secretError = "Password must include a symbol";
    } else {
      $scope.ui.secretError = "";
    }
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $scope.load();
});


