'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $mdToast, $timeout, $shared ) {
    $shared.updateTitle("Workspace User Edit");
    var roles = $shared.makeDefaultWorkspaceRoles();
    $scope.availableRoles = $shared.makeDefaultWorkspaceRoles(true);


  $scope.values = {
    user: {
      first_name: "",
      last_name: "",
      email: ""
    },
    roles: $shared.makeDefaultWorkspaceRoles()
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
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
      Backend.post("/workspaceUser/updateUser/" + $stateParams['userId'], values).then(function() {
       console.log("added user..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Added user to workspace')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('settings-workspace-users', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  Backend.get("/workspaceUser/userData/" + $stateParams['userId']).then(function(res) {
      var user = res.data;
      $scope.values.user['email'] = user.email;
      $scope.values.user['first_name'] = user.first_name;
      $scope.values.user['last_name'] = user.last_name;
      for (var key in roles) {
        console.log("checking for role ", key);
        $scope.values.roles[ key ] = user[ key ];
      }
      console.log("$scope.values are ", $scope.values);
    });
  $timeout(function() {
    $shared.endIsLoading();
  }, 0);
});

