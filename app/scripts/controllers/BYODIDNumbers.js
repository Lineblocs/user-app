'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYODIDNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My DIDNumbers");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.numbers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/byo/did/listNumbers" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }

  $scope.importNumbers = function($event) {
    console.log("importNumbers called..");
    $mdDialog.show({
      controller: DialogImportController,
      templateUrl: 'views/dialogs/import-byo-numbers.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onAdded: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });

  }
  $scope.createNumber = function() {

    $state.go('byo-did-number-create');
  }
  $scope.editNumber = function(number) {

    $state.go('byo-did-number-edit', {numberId: number.public_id});
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this DID number?')
          .textContent('If you delete this carrier you will not be able to call it anymore')
          .ariaLabel('Delete')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/byo/did/deleteNumber/" + number.public_id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Number deleted..')
                .position("top right")
                .hideDelay(3000)
            );
          });

      })
    }, function() {
    });
  }

    function DialogImportController($scope, $mdDialog, Backend, $shared, onAdded) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        number: ""
      };
      $scope.submit= function($event) {
        var params = new FormData();
      params.append("file", angular.element("#uploadFile").prop("files")[0]);
      $shared.isLoading = true;
    Backend.postFiles("/byo/did/importNumbers", params, true).then(function () {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
          .textContent('Imported numbers..')
          .position("top right")
          .hideDelay(3000)
        );
        $mdDialog.hide(); 
        $shared.endIsLoading();
        onAdded();
      }, function() {
        $shared.endIsLoading();
      });
      }
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.load();
});

