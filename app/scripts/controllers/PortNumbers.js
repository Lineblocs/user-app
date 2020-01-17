'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PortNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, SharedPref, $q) {
    SharedPref.updateTitle("Ported Numbers");
    $scope.pagination = pagination;
  $scope.numbers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      SharedPref.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/port/listNumbers" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      SharedPref.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.portNumber = function() {
    $state.go('port-create', {});
  }
  $scope.editNumber = function(number) {
    $state.go('port-edit', {numberId: number.public_id});
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('If you delete this number you will not be able to call it anymore')
          .ariaLabel('Delete number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      SharedPref.isLoading = true;
      Backend.delete("/port/deleteNumber/" + number.id).then(function() {
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

