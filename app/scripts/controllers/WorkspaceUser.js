'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Workspace Users");
  $scope.users = [];
  $scope.Backend = Backend;

  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/workspaceUser/list").then(function(res) {
          $scope.users = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.deleteUser = function($event, user) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to remove this user from your workspace ?')
          .textContent('This will permantely remove the user from your workspace')
          .ariaLabel('Delete user')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/workspaceUser/" + user.public_id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('User deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }
  $scope.resendInvite = function(user) {
    // Appending dialog to document.body to cover sidenav in docs app
      Backend.post("/workspaceUser/" + user.public_id + "/resendInvite").then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Invite email sent..')
            .position("top right")
            .hideDelay(3000)
        );
          });
        });
  }
  $scope.editUser = function($event, user) {
    console.log("edit usr ", user);
    $shared.changeRoute('settings-workspace-users-edit', {userId: user.public_id});
  }
  $scope.createUser = function() {

    $shared.changeRoute('settings-workspace-users-create', {});
  }
  $scope.deactivateAccount = function($event, user) {
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to deactivate this account?')
          .textContent('This will deactivate the user account')
          .ariaLabel('Deactivate account')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.post("/workspaceUser/" + user.public_id + "/deactivate").then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Account deactivated..')
            .position("top right")
            .hideDelay(3000)
        );
          });
      })
    }, function() {
    });
  }
  $scope.changeAccountType = function($event, user) {
    var dialogScope = $scope.$new();
    dialogScope.accountTypes = ['ADMIN', 'EDITOR', 'VIEWER'];
    dialogScope.selectedType = user.account_type || 'VIEWER';
    
    var dialog = $mdDialog.show({
      scope: dialogScope,
      preserveScope: true,
      targetEvent: $event,
      clickOutsideToClose: true,
      template: `
        <md-dialog aria-label="Change Account Type" style="min-width: 400px;">
          <md-toolbar class="md-primary">
            <div class="md-toolbar-tools">
              <h2>Change Account Type</h2>
              <span flex></span>
              <md-button class="md-icon-button" ng-click="cancel()">
                <md-icon aria-label="Close">close</md-icon>
              </md-button>
            </div>
          </md-toolbar>
          <md-dialog-content style="padding: 20px;">
            <md-input-container class="md-block" style="margin-top: 20px;">
              <label>Select Account Type</label>
              <md-select ng-model="selectedType" style="min-width: 100%;">
                <md-option ng-repeat="type in accountTypes" value="{{type}}">
                  {{$shared.accountTypeValue(type)}}
                </md-option>
              </md-select>
            </md-input-container>
          </md-dialog-content>
          <md-dialog-actions layout="row" layout-align="end center" style="padding: 16px;">
            <md-button ng-click="cancel()" class="md-primary">
              Cancel
            </md-button>
            <md-button ng-click="confirm()" class="md-primary md-raised">
              Update
            </md-button>
          </md-dialog-actions>
        </md-dialog>
      `
    });
    
    dialogScope.confirm = function() {
      $shared.isLoading = true;
      Backend.post("/workspaceUser/" + user.public_id + "/changeAccountType", { accountType: dialogScope.selectedType }).then(function() {
        $scope.load().then(function() {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Account type changed to ' + dialogScope.selectedType)
              .position("top right")
              .hideDelay(3000)
          );
          $mdDialog.hide();
        });
      });
    };
    
    dialogScope.cancel = function() {
      $mdDialog.cancel();
    };
  }



  $scope.load();
});

