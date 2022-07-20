'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HostedTrunksCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("Hosted Trunks");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.trunks = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/trunk/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'trunks' );
      pagination.loadData().then(function(res) {
      $scope.trunks = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.editTrunk = function(trunk) {

    $state.go('hosted-trunks-edit', {trunkId: trunk.public_id});
  }
  $scope.createTrunk = function(trunk) {
    $state.go('hosted-trunks-create');
  }
  $scope.deleteTrunk = function($event, trunk) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this trunk?')
          .textContent('you will not be able to use this trunk any longer')
          .ariaLabel('Delete')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/trunk/deleteTrunk/" + trunk.public_id).then(function() {
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

