'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowEditorCtrl', function ($scope, Backend, $location, $state, $mdDialog, SharedPref, $stateParams, $sce) {
  $scope.settings = {
    page: 0
  };
  $scope.numbers = [];
  var flowUrl;
  var token = SharedPref.getAuthToken();
  if ($stateParams['flowId'] === "new" ) {
    flowUrl = SharedPref.FLOW_EDITOR_URL+"/create?auth="+token.token;
  } else {
    flowUrl = SharedPref.FLOW_EDITOR_URL + "/edit?flowId=" + $stateParams['flowId']+"&auth="+token.token;
  }
  $scope.flowUrl = $sce.trustAsResourceUrl(flowUrl);
  console.log("flow url is ", $scope.flowUrl);
  SharedPref.collapseNavbar();
});

