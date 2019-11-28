'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, SharedPref, $q) {
    SharedPref.updateTitle("Extensions");
    $scope.pagination = pagination;
    
    function DialogController($scope, $mdDialog, extension, SharedPref) {
      $scope.SharedPref = SharedPref;
      $scope.extension = extension;
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }
  $scope.settings = {
    page: 0
  };
  $scope.extensions = [];
  $scope.load = function() {
      SharedPref.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/extension/listExtensions" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'extensions');
      return $q(function(resolve, reject) {
        pagination.loadData().then(function(res) {
        $scope.extensions = res.data.data;
        SharedPref.endIsLoading();
        resolve();
        }, reject);
      });
  }
  $scope.editExtension = function(extension) {
    $state.go('extension-edit', {extensionId: extension.public_id});
  }
  $scope.createExtension = function(extension) {
    $state.go('extension-create', {});
  }
  $scope.connectInfo = function($event, extension) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/extension-connect-info.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "extension": extension
      }
    })
    .then(function() {
    }, function() {
    });
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
        SharedPref.isLoading = true;
      Backend.delete("/extension/deleteExtension/" + extension.public_id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Extension deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }

  $scope.load();
});

