'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGroupsEditCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $stateParams ) {
	  $shared.updateTitle("Create Phone Group");
  $scope.values = {
    number: "",
    name: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting phone form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['number'] = $scope.values.number;
      values['name'] = $scope.values.name;
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
      Backend.post("/phoneGroup/updatePhoneGroup/" + $stateParams['phoneGroupId'], values).then(function() {
       console.log("updated phone..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Updated phone group')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('phones-groups', {});
        $shared.endIsCreateLoading();
      });
    }
  }


      Backend.get("/phoneGroup/phoneGroupData/" + $stateParams['phoneGroupId']).then(function(res) {
        $scope.values = res.data;
      });

  });

