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
  $scope.number = null;
  $scope.saveNumber = function(number) {
    var params = {};
    params['name'] = $scope.number.name;
    params['flow_id'] = $scope.number.flow_id;
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
      SharedPref.isCreateLoading = false;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Number updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('my-numbers', {});
    });
  }
  $scope.changeFlow = function(flow) {
    $scope.number.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $q.all([
    Backend.get("/flow/listFlows"),
    Backend.get("/did/numberData/" + $stateParams['numberId'])
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $scope.number = res[1].data;
  });
});

