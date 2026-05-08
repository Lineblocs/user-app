'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular
  .module('Lineblocs')
  .controller(
    'ExtensionsCtrl',
    function (
      $scope,
      Backend,
      pagination,
      $location,
      $state,
      $mdDialog,
      $mdToast,
      $shared,
      $q,
      $stateParams
    ) {
      $shared.updateTitle('Extensions');
      $scope.$stateParams = $stateParams;
      $scope.$shared = $shared;
      $scope.pagination = pagination;
      $scope.Backend = Backend;

      function DialogController($scope, $mdDialog, extension, $shared) {
        $scope.$shared = $shared;
        $scope.extension = extension;
        $scope.isSendingEmail = false;
        $scope.close = function () {
          $mdDialog.hide();
        };
        $scope.sendCredentialsEmail = function (ev) {
          var prompt = $mdDialog
            .prompt()
            .title('Send SIP Credentials')
            .textContent('Enter the email address to receive these SIP credentials.')
            .placeholder('name@example.com')
            .ariaLabel('Destination email')
            .targetEvent(ev)
            .ok('Send')
            .cancel('Cancel');

          $mdDialog.show(prompt).then(function (email) {
            var normalizedEmail = (email || '').trim();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var extensionId = extension.id;

            if (!emailRegex.test(normalizedEmail)) {
              $mdToast.show(
                $mdToast
                  .simple()
                  .textContent('Please enter a valid email address.')
                  .position('top right')
                  .hideDelay(3000)
              );
              return;
            }

            if (!extensionId) {
              $mdToast.show(
                $mdToast
                  .simple()
                  .textContent('Could not determine extension id.')
                  .position('top right')
                  .hideDelay(3000)
              );
              return;
            }

            $scope.isSendingEmail = true;
            Backend.post('/emailSIPCredentials', {
              to_email: normalizedEmail,
              extension_id: extensionId,
            }).then(
              function () {
                $mdToast.show(
                  $mdToast
                    .simple()
                    .textContent('SIP credentials sent successfully.')
                    .position('top right')
                    .hideDelay(3000)
                );
              },
              function () {}
            )['finally'](function () {
              $scope.isSendingEmail = false;
            });
          });
        };
      }
      $scope.settings = {
        page: 0,
      };
      $scope.extensions = [];
      $scope.load = function () {
        $shared.isLoading = true;
        pagination.resetSearch();
        pagination.changeUrl('/extension/list');
        pagination.changePage(1);
        pagination.changeScope($scope, 'extensions');
        return $q(function (resolve, reject) {
          pagination.loadData().then(function (res) {
            $scope.extensions = res.data.data;
            $shared.endIsLoading();
            resolve();
          }, reject);
        });
      };
      $scope.editExtension = function (extension) {
        $state.go('extension-edit', { extensionId: extension.public_id });
      };
      $scope.createExtension = function (extension) {
        $state.go('extension-create', {});
      };
      $scope.connectInfo = function ($event, extension) {
        $mdDialog
          .show({
            controller: DialogController,
            templateUrl: 'views/dialogs/extension-connect-info.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
              extension: extension,
            },
          })
          .then(
            function () {},
            function () {}
          );
      };
      $scope.deleteExtension = function ($event, extension) {
        $mdDialog
          .show({
            controller: DeleteExtensionDialogCtrl,
            template: `
      <md-dialog aria-label="Delete extension">
        <form ng-cloak>
          <md-toolbar>
            <div class="md-toolbar-tools">
              <h2>Delete Extension</h2>
            </div>
          </md-toolbar>

          <md-dialog-content style="max-width:600px;">
            <p style="text-align: left; margin-top: 16px; margin-left: 16px;">
              Are you sure you want to delete this extension?
              This will permanently remove the extension and you will no longer be able to use it.
            </p>

            <md-input-container class="md-block" style="margin-left: 16px; width: 50%; margin-top: 16px;">
              <label>Type <b>
              ${extension ? extension?.username : 'no name'}
              </b> to enable delete</label>
              <input ng-model="confirmText">
            </md-input-container>
          </md-dialog-content>

          <md-dialog-actions layout="row">
            <span flex></span>
            <md-button ng-click="cancel()">No</md-button>
            <md-button 
                class="md-raised md-warn"
                ng-disabled="confirmText !== '${extension ? extension?.username : 'no name'}'"
                ng-click="confirm()">
              Delete
            </md-button>
          </md-dialog-actions>
        </form>
      </md-dialog>
    `,
            targetEvent: $event,
            clickOutsideToClose: true,
          })
          .then(function () {
            $shared.isLoading = true;

            Backend.delete('/extension/' + extension.public_id).then(function () {
              $scope.load().then(function () {
                $mdToast.show(
                  $mdToast
                    .simple()
                    .textContent('Extension deleted..')
                    .position('top right')
                    .hideDelay(3000)
                );
              });
            });
          });
      };

      $scope.load();
    }
  );

function DeleteExtensionDialogCtrl($scope, $mdDialog) {
  $scope.confirmText = '';

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.confirm = function () {
    $mdDialog.hide(true);
  };
}
