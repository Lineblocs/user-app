'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FaxesCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $sce, $shared, $q, $mdToast) {
    $shared.updateTitle("Faxes");
    $scope.Backend = Backend;
  $scope.settings = {
    page: 0
  };
  $scope.pagination = pagination;
  $scope.faxes = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
        pagination.changeUrl( "/fax/listFaxes" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'faxes' );
        pagination.loadData().then(function(res) {
        var faxes = res.data.data;
        $scope.faxes = faxes.map(function(obj) {
          obj.uri = $sce.trustAsResourceUrl(obj.uri);
          return obj;
        });
        $shared.endIsLoading();
        resolve();
      }, reject)
    });
  }
  $scope.deleteFax = function($event, fax) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this fax?')
          .textContent('This will permantely remove the fax from your storage')
          .ariaLabel('Delete fax')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/fax/deleteFax/" + fax.id).then(function() {
        console.log("deleted fax..");
        $scope.load().then(function() {
          $mdToast.show(
            $mdToast.simple()
              .textContent('fax deleted..')
              .position('top right')
              .hideDelay(3000)
          );
        })
      });
    }, function() {
    });
  }

  $scope.load();
});

