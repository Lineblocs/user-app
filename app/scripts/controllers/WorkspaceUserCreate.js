'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Create Extension");
    $scope.availableRoles = $shared.makeDefaultWorkspaceRoles(true);

  $scope.values = {
    user: {
      first_name: "",
      last_name: "",
      email: ""
    },
    roles: $shared.makeDefaultWorkspaceRoles()
  };
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting workspace user form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {
        user: angular.copy($scope.values.user),
        roles: angular.copy($scope.values.roles)
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
      Backend.post("/workspaceUser", values).then(function(res) {
       console.log("added user..");
       var id = res.headers('X-WorkspaceUser-ID');
        $mdToast.show(
          $mdToast.simple()
            .textContent('Added user to workspace')
            .position("top right")
            .hideDelay(3000)
        );
      $state.go('settings-workspace-users-assign', {
          userId: id
      });
        $shared.endIsCreateLoading();
      });
    }
  }
  $timeout(function() {
    $q.all([
      Backend.get("/extension/list?all=1"),
      Backend.get("/did/list?all=1"),
    ]).then(function(res) {
      $shared.endIsLoading();
      $scope.extensions = res[0].data.data;
      $scope.numbers  = res[1].data.data;
      console.log("data ", res);
    });
  }, 0);

});

