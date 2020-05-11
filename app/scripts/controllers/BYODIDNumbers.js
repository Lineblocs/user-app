'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BYODIDNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q) {
    $shared.updateTitle("My DIDNumbers");
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
      Backend.delete("/byo/did/deleteNumber/" + number.id).then(function() {
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

  $scope.load();
});

