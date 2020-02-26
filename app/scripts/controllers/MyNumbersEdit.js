'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('MyNumbersEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, SharedPref) {
	  SharedPref.updateTitle("Edit Number");
  $scope.flows = [];
  $scope.didActions = [
    {
      name: 'Accept Call',
      value: 'accept-call'
    },
    {
      name: 'Accept Fax',
      value: 'accept-fax'
    },

  ]
  $scope.number = null;
  $scope.saveNumber = function(number) {
    var params = {};
    params['name'] = $scope.number.name;
    params['flow_id'] = $scope.number.flow_id;
    params['did_action'] = $scope.number.did_action;
    params['tags'] = $scope.number.tags;
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
      SharedPref.isCreateLoading = true;
    Backend.post("/did/updateNumber/" + $stateParams['numberId'], params).then(function() {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Number updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('my-numbers', {});
      SharedPref.endIsCreateLoading();
    });
  }
  $scope.changeFlow = function(flow) {
    $scope.number.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.changeDIDAction = function(action) {
    $scope.number.did_action = action;
    console.log("changeDIDAction", action);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  SharedPref.isLoading = true;
  $q.all([
    Backend.get("/flow/listFlows?all=1"),
    Backend.get("/did/numberData/" + $stateParams['numberId'])
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $scope.number = res[1].data;
    SharedPref.endIsLoading();
  });
});

