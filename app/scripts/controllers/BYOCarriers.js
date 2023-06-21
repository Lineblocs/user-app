'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYOCarriersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Carriers");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.carriers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/byo/carrier/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'carriers' );
      pagination.loadData().then(function(res) {
      $scope.carriers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.editCarrier = function(carrier) {

    $state.go('byo-carrier-edit', {carrierId: carrier.public_id});
  }
  $scope.createCarrier = function(carrier) {

    $state.go('byo-carrier-create');
  }
  $scope.deleteCarrier = function($event, carrier) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this carrier?')
          .textContent('you will not be able to use this carrier any longer')
          .ariaLabel('Delete')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/byo/carrier/" + carrier.public_id).then(function() {
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

