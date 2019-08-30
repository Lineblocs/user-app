'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, SharedPref) {
	  SharedPref.updateTitle("Extensions");
  $scope.settings = {
    page: 0
  };
  $scope.extensions = [];
  $scope.load = function() {
      SharedPref.isLoading = true;
    Backend.get("/extension/listExtensions", $scope.settings).then(function(res) {
      $scope.extensions = res.data.data;
      SharedPref.isLoading = false;
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
          .title('Are you sure you want to delete this extension?')
          .textContent('This will permantely remove the extension and you will no longer be able to use it')
          .ariaLabel('Delete extension')
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

