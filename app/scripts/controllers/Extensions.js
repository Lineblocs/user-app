'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast) {
  $scope.settings = {
    page: 0
  };
  $scope.extensions = [];
  $scope.load = function() {
    Backend.get("/extension/listExtensions", $scope.settings).then(function(res) {
      $scope.extensions = res.data.data;
    })
  }
  $scope.editExtension = function(extension) {
    $state.go('extension-edit', {extensionId: extension.id});
  }
  $scope.createExtension = function(extension) {
    $state.go('extension-create', {});
  }
  $scope.deleteExtension = function($event, extension) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this flow?')
          .textContent('This will permantely remove the flow and also unset the flow on numbers that have this flow attached to it')
          .ariaLabel('Delete flow')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      Backend.delete("/extension/deleteExtension/" + extension.id).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Extension deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          $scope.load();

      })
    }, function() {
    });
  }

  $scope.load();
});

