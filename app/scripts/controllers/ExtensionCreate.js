'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q) {
    $shared.updateTitle("Create Extension");
    $scope.isDialog = false;
  $scope.values = {
    username: "",
    secret: "",
    tags: [],
    flow_id: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0,
    secretError: ""
  }
  $scope.triedSubmit = false;

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
        values['caller_id'] = $scope.values.caller_id;
        values['secret'] = $scope.values.secret;
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
        Backend.postCouldError("/extension/saveExtension", values).then(function(res) {
        console.log("updated extension..");
        console.log("save ext ", res);
        var id = res.headers("x-extension-id");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Created extension')
              .position("top right")
              .hideDelay(3000)
          );
          console.log("isDialog ", $scope.isDialog);

          if ( !$scope.isDialog ) {
            $state.go('extensions', {});
            $shared.endIsCreateLoading();
          } else {
            console.log("calling emit ", id);
            $scope.$emit("Created", id)
            $mdDialog.hide();
          }


          }, function() {

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
  $scope.setupFlow = function($event, extension) {
      var title = "Unititled Flow";
    if ( $scope.values.username !== '' ) {
      var title = "Flow for " + $scope.values.username;
    }

    $mdDialog.show({
      controller: SetupDialogController,
      templateUrl: 'views/dialogs/setup-flow.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      skipHide: true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "title": title,
        "category": "extension",
        "onSuccess": function(flowId) {
          load().then(function() {
            console.log("setting flow ", flowId);
            angular.forEach($scope.flows, function(flow) {
              if ( flow.public_id === flowId) {
                  $scope.values['flow_id'] = flow.id;
              }
            });
            $mdDialog.hide();
          } );
        },
        "onError": function(flowId) {
          console.error("error occured..");
        },

      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.init = function(isDialog) {
    $scope.isDialog = isDialog;
  }

  function load() {
    return $q(function(resolve, reject) {
      Backend.get("/flow/listFlows?category=extension").then(function(res) {
        $scope.flows = res.data.data;
          $shared.endIsLoading();
          resolve();
      }, reject);
    });
  }
  $timeout(function() {
    load();
  }, 0);
});

