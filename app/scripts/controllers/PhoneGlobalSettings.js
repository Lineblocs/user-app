'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PhoneGlobalSettingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout) {
    $shared.updateTitle("PhoneGlobalSettings");
    $scope.settings = [];
  $scope.load = function() {
      Backend.get( "/phoneGlobalSetting/listPhoneGlobalSettings" ).then(function(res) {
          $scope.settings = res.data.data;
          $shared.endIsLoading();
      });
  }
  $scope.createSettings =  function() {
    $state.go('phones-global-settings-create');
  }
  $scope.modifyPhoneSettings = function($event, phoneSettings) {
    console.log("edit phone settings ", phoneSettings);
    $state.go('phones-global-settings-modify', {phoneSettingsId: phoneSettings.public_id});
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
      Backend.delete("/phoneGlobalSetting/deletePhoneSetting/" + phone.id).then(function() {
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
  $timeout(function() {
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/listPhoneGroups?all=1")
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
        $shared.endIsLoading();
    });
  }, 0);

    $scope.load();
});

