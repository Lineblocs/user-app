'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneIndividualSettingsModifyCategoryCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
    $shared.updateTitle("PhoneIndividualSettings Create");
    $scope.$stateParams = $stateParams;
    $scope.settings = [];
    $scope.fields = [];
    $scope.submit = function(form) {
      console.log("submitting phone form ", arguments);
      $scope.triedSubmit = true;
      if (form.$valid) {
        var values = {};
        angular.forEach($scope.fields, function(field) {
          values[ field.setting_variable_name ] = field.value;
        });
        console.log("sending result ", values);
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
        $shared.isLoading = true;
        Backend.post("/phoneIndividualSetting/" + $stateParams['phoneSettingId'], values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Updated phone settings')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('phones-individual-settings-modify', {phoneSettingId:$stateParams['phoneSettingId']});
          $shared.endIsCreateLoading();
        });
      }
    }


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
$scope.changeSelectValue = function(field, fieldValue)
{
  console.log("changeSelectValue ", arguments);
  field.value = fieldValue;
  console.log("fields are now ", $scope.fields);
}
$scope.createOptions = function(field) 
  {
    var start = 1;
    var end= 20;
    var options = [];
    while (start <= end) {
      var value = field['setting_option_' + start];
      var name = field['setting_option_' + start + '_name'];
      var option = {
        name: name,
        value: value
      };
      options.push( option );
      start = start + 1;
    }
    return options;
  }

    $shared.isLoading = true;
  Backend.get("/phoneIndividualSetting/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }
    qsMap['settingId'] = $stateParams['phoneSettingId'];
    qsMap['categoryId'] = $stateParams['categoryId'];
    Backend.get("/getPhoneIndividualSettingsByCat", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
      $scope.template = res.data.settings;
      $scope.values = res.data.values;
      angular.forEach($scope.template, function(field) {
        $scope.fields.push( field );
      });
      angular.forEach($scope.values, function(value) {
        angular.forEach($scope.fields, function(field) {
          if (field.setting_variable_name === value.setting_variable_name) {
            field.value = value.setting_option_1;
          }
        });
      });

      $shared.endIsLoading();
    });
  });
});

