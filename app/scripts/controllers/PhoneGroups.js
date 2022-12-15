'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGroupsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $stateParams) {
    $shared.updateTitle("PhoneGroups");
    $scope.phoneGroups = [];
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.load = function() {
   $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/phoneGroup/listPhoneGroups" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'phoneGroups' );
      pagination.loadData().then(function(res) {
        $scope.phoneGroups= res.data.data;
        $shared.endIsLoading();
    })
  }
  $scope.createPhoneGroup = function() {
    $state.go('phones-groups-create');

  }
  $scope.editPhoneGroup = function($event, phoneGroup) {
    console.log("edit phone group ", phoneGroup);
    $state.go('phones-groups-edit', {phoneGroupId: phoneGroup.public_id});
  }
  $scope.deletePhoneGroup = function($event, group) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone group?')
          .textContent('If you delete this phone group it will also delete all related setting templates')
          .ariaLabel('Delete phone group')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phoneGroup/deletePhoneGroup/" + group.id).then(function() {
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

