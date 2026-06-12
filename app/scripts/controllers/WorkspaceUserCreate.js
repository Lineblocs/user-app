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
      email: "",
      assigned_role_id: ""
    },
    roles: $shared.makeDefaultWorkspaceRoles()
  };
  $scope.triedSubmit = false;


  $scope.applyPresetPermissions = function(preset) {
    // Reset all permissions to false first
    $scope.values.roles = $shared.makeDefaultWorkspaceRoles();
    
    // Define preset permission mappings
    var presets = {
      'calling_manager': {
        manage_calls: true,
        manage_extensions: true,
        create_extension: true,
        manage_recordings: true,
      },
      'billing_manager': {
        manage_billing: true,
      },
      'reporting_analyst': {
        manage_calls: true,
        manage_recordings: true,
      },
      'support_agent': {
        manage_support: true,
        manage_calls: true,
      },
      'account_admin': {
        manage_users: true,
        manage_extensions: true,
        manage_billing: true,
        manage_workspace: true,
        manage_dids: true,
        manage_flows: true,
        manage_phones: true,
        manage_ports: true,
        manage_byo_carriers: true,
        manage_byo_did_numbers: true,
        manage_trunks: true,
        create_extension: true,
        create_flow: true,
        create_phone: true,
        create_phonegroup: true,
        manage_phonegroups: true,
      },
      'viewer': {
        manage_calls: true,
        manage_recordings: true,
      }
    };
    
    if (presets[preset]) {
      angular.extend($scope.values.roles, presets[preset]);
    }
  };

  $scope.submit = function(form) {
    console.log("submitting workspace user form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {
        assigned_role_id: $scope.values.user.assigned_role_id,
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



  // $scope.changeRole = function(value) {
  //   console.log(value)
  // }
  $timeout(function() {
    $q.all([
      Backend.get("/extension/list?all=1"),
      Backend.get("/did/list?all=1"),
      Backend.get("/workspaceUser/getWorkspaceRoles"),
    ]).then(function(res) {
      $shared.endIsLoading();
      $scope.extensions = res[0].data.data;
      $scope.numbers  = res[1].data.data;
      $scope.roleList  = res[2].data.roles;
      console.log("data ", res);
    });
  }, 0);

});

