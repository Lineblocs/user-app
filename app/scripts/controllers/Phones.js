'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhonesCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $mdToast, $stateParams) {
    $shared.updateTitle("Phones");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
    $scope.phones = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
          pagination.resetSearch();
          pagination.changeUrl( "/phone/listPhones" );
          pagination.changePage( 1 );
          pagination.changeScope( $scope, 'phones' );
          pagination.loadData().then(function(res) {
          $scope.calls = res.data.data;
          $shared.endIsLoading();
          resolve();
        })
      });
  }
  $scope.createPhone = function() {
    $state.go('phones-phone-create');

  }
  $scope.editPhone = function($event, phone) {
    console.log("editPhone ", phone);
    $state.go('phones-phone-edit', {phoneId: phone.public_id});
  }
  $scope.deletePhone = function($event, phone) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone?')
          .textContent('If you delete this phone you will not be able to call it anymore')
          .ariaLabel('Delete phone')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phone/" + phone.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Phone deleted..')
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

