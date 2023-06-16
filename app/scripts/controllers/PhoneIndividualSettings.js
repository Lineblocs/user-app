'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneIndividualSettingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout) {
    $shared.updateTitle("PhoneIndividualSettings");
    $scope.settings = [];
  $scope.load = function() {
      Backend.get( "/phoneIndividualSetting/list" ).then(function(res) {
          $scope.settings = res.data.data;
          $shared.endIsLoading();
      });
  }
  $scope.modifyPhoneSetting = function($event, phoneSettings) {
    console.log("edit phone settings ", phoneSettings);
    $state.go('phones-individual-settings-modify', {phoneSettingId: phoneSettings.public_id});
  }
  $scope.deletePhoneSettings = function($event, phoneSettings) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone settings group?')
          .textContent('If you delete this phone setting group it will also delete all related setting templates')
          .ariaLabel('Delete phone setting')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phoneGlobalSetting/" + phone.id).then(function() {
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

