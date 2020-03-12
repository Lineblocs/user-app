'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PhoneIndividualSettingsModifyCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
    $shared.updateTitle("PhoneIndividualSettings Create");
    $scope.settings = [];
    $scope.values = {
      phone_type: null,
      group_id: null,
    };

    $scope.openCategory = function(category) {
          $state.go('phones-individual-settings-modify-category', {
            phoneSettingId:$stateParams['phoneSettingId'],
            categoryId:category['name']
          });
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
    $shared.isLoading = true;
  Backend.get("/phoneIndividualSetting/phoneIndividualSettingData/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }

    $shared.isLoading = true;
    Backend.get("/getPhoneDefaults", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
      $scope.template = res.data;
      $shared.endIsLoading();
    });
  });
});

