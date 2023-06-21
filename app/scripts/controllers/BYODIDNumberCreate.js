'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYODIDNumberCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
	  $shared.updateTitle("Create DIDNumber");
  $scope.values = {
    username: "",
    secret: "",
    tags: [],
    flow_id: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting number form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['number'] = $scope.values.number;
      values['flow_id'] = $scope.values.flow_id;
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
      Backend.post("/byo/did", values).then(function() {
       console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created carrier')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('byo-did-numbers', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $q.all([
    Backend.get("/flow/list?all=1"),
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $shared.endIsLoading();
  });
});

