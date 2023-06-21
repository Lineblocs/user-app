'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGlobalSettingsCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast) {
    $shared.updateTitle("PhoneGlobalSettings Create");
    $scope.settings = [];
    $scope.values = {
      phone_type: null,
      group_id: null,
    };
    $scope.submit = function(form) {
      console.log("submitting phone form ", arguments);
      $scope.triedSubmit = true;
      if (form.$valid) {
        var values = {};
        values['phone_type'] = $scope.values.phone_type;
        values['phone_group'] = $scope.values.group_id;
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
          .filter(function(pos) { return toastPos[pos]; })
          .join(' ');
        console.log("toastPosStr", toastPosStr);
        $shared.isCreateLoading = true;
        Backend.post("/phoneGlobalSetting", values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Created phone settings')
              .position("top right")
              .hideDelay(3000)
          );
          console.log("res is ", res);
          var id = res.headers("X-GlobalSetting-ID");
          console.log("global setting id is", id);
          $state.go('phones-global-settings-modify', {phoneSettingId:id});
          $shared.endIsCreateLoading();
        });
      }
    }


  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
  $timeout(function() {
    $shared.isLoading = true;
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/list?all=1")
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
        $shared.endIsLoading();
    });
  }, 0);
});

