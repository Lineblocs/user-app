'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserAssignCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $stateParams ) {
    $shared.updateTitle("Create Extension");
    $scope.availableRoles = $shared.makeDefaultWorkspaceRoles(true);

  $scope.values = {
    user: {
      first_name: "",
      last_name: "",
      email: ""
    },
    roles: $shared.makeDefaultWorkspaceRoles(),
    preferred_pop: null,
    extension_id: null,
  };
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting workspace user form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {
        assign: {
          "extension_id": $shared.nullIfEmpty( $scope.values.extension_id ),
          "number_id": $shared.nullIfEmpty( $scope.values.number_id ),
          "preferred_pop": $shared.nullIfEmpty( $scope.values.preferred_pop ),
        }
      };
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
      Backend.post("/workspaceUser/" + $stateParams['userId'], values).then(function() {
       console.log("updated user..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Assigned user settings.')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('settings-workspace-users', {});
        $shared.endIsCreateLoading();
      });
    }
  }

  $scope.setupExtension = function($event) {
    $mdDialog.show({
      controller: SetupExtDialogController,
      templateUrl: 'views/dialogs/setup-ext.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "onSuccess": function(extId) {
          console.log("new extension is ", extId);
          $scope.extId = extId;
          load().then(function() {
            //console.log("selecting extension ID in dropdown")
            //$scope.values.extension_id = extId;
          });
        },
        "onError": function(flowId) {
          console.error("error occured..");
        }
      }
    })
    .then(function() {
    }, function() {
    });
  }

  $scope.setupNumber = function($event) {
    $mdDialog.show({
      controller: SetupNumberDialogController,
      templateUrl: 'views/dialogs/setup-number.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "onSuccess": function(numberId) {
          console.log("new number is ", numberId);
          $scope.numberId = numberId;
          load().then(function() {
            console.log('reloaded data successfully.');
          });

        },
        "onError": function(flowId) {
          console.error("error occured..");
        }
      }
    })
    .then(function() {
    }, function() {
    });
  }

  function load() {
    return $q(function(resolve, reject) {
      $q.all([
        Backend.get("/workspaceUser/" + $stateParams['userId']),
        Backend.get("/extension/list?all=1"),
        Backend.get("/did/list?all=1"),
        Backend.get("/getPOPs")
        ]).then(function(res) {
          var user = res.data;
          $scope.extensions = res[1].data.data;
          $scope.numbers = res[2].data.data;
          $scope.pops = res[3].data;
            console.log("$scope.values are ", $scope.values);
          angular.forEach($scope.extensions, function(ext) {
            if ( $scope.extId && $scope.extId === ext.public_id ) {
              $scope.values.extension_id = ext.id;
              $scope.extId = null;
            }
          });
          angular.forEach($scope.numbers, function(number) {
            if ( $scope.numberId && $scope.numberId === number.public_id ) {
              $scope.values.number_id = number.id;
              $scope.numberId = null;
            }
          });

          console.log("values are ", $scope.values);
          resolve();
        }, function() {
          reject();
        });
      });
    }

  load();

  $timeout(function() {
    $shared.endIsLoading();
  }, 0);
});

