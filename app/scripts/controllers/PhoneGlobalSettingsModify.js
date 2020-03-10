'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PhoneGlobalSettingsModifyCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
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
        Backend.post("/phoneGlobalSetting/savePhoneGlobalSetting", values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Created phone')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('phones-global-settings-modify', {phoneSettingId:res.headers("X-GlobalSetting-ID")});
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
  Backend.get("/phoneGlobalSetting/phoneGlobalSettingData/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }
    Backend.get("/getPhoneSettingsByCat", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
    });
  });
});

