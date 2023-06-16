'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $mdToast, $timeout, $shared, $q ) {
	  $shared.updateTitle("Edit Phone");
  $scope.values = {
    name: "",
    phone_type: null,
    mac_address: "",
    group_id: null,
    tags: []
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.generateSecret = function() {
    $scope.values.secret = generatePassword();
  }
  $scope.showSecret = function() {
    $scope.ui.showSecret = true;
  }
  $scope.hideSecret = function() {
    $scope.ui.showSecret = false;
  }
  $scope.submit = function(form) {
    console.log("submitting phone form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['name'] = $scope.values.name;
      values['mac_address'] = $scope.values.mac_address;
      values['phone_type'] = $scope.values.phone_type;
      values['group_id'] = $scope.values.group_id;
      values['tags'] = $scope.values.tags;
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
      Backend.post("/phone/" + $stateParams['phoneId'], values).then(function() {
       console.log("updated phone..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Edited phone')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('phones-phones', {});
        $shared.endIsEditLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $shared.isLoading = true;
  $timeout(function() {
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/list?all=1"),
      Backend.get("/phone/" + $stateParams['phoneId'])
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
      $scope.values = res[2].data;
        $shared.endIsLoading();
    });
  }, 0);
});

