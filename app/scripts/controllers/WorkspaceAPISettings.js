'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('WorkspaceAPISettingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q) {
      $shared.updateTitle("Workspace API Settings");
      $scope.settings = {};
      $scope.load = function () {
        $shared.isLoading = true;
        return $q(function (resolve, reject) {
          Backend.get("/getWorkspaceTokens").then(function (res) {
            $scope.settings = res.data;
            $shared.endIsLoading();
            resolve();
          }, function () {
            reject();
          });
        });
      }
      $scope.refreshTokens = function ($event) {
        var confirm = $mdDialog.confirm()
          .title('Are you sure you want to refresh API tokens?')
          .textContent('if you are using these API tokens in any code the code will stop working and you will need to replace the API tokens with the new ones you create')
          .ariaLabel('Refresh tokens')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
        $mdDialog.show(confirm).then(function () {
            $shared.isLoading = true;
            Backend.get("/refreshWorkspaceTokens").then(function (res) {
              $scope.load().then(function () {
                $mdToast.show(
                  $mdToast.simple()
                  .textContent('API tokens recreated')
                  .position("top right")
                  .hideDelay(3000)
                );
              });
            });
          });
        }
        $scope.promptCopied = function () {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Copied to clipboard!')
            .position("top right")
            .hideDelay(3000)
          );

        }
        $scope.load();
      });
