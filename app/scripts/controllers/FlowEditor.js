'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowEditorCtrl', function ($scope, Backend, $location, $state, $mdDialog, SharedPref, $stateParams, $sce) {
	  SharedPref.updateTitle("Flow Editor");
  $scope.settings = {
    page: 0
  };
  $scope.numbers = [];
  function sizeTheIframe() {
    var element = angular.element(".flow-editor-iframe");
    var windowHeight = $(window).outerHeight();
    var padding = 0;
    element.attr("height",windowHeight);
  }
  var flowUrl;
  var token = SharedPref.getAuthToken();
  var workspace = SharedPref.getWorkspace();

  if ($stateParams['flowId'] === "new" ) {
    flowUrl = SharedPref.FLOW_EDITOR_URL+"/create?auth="+token.token.auth + "&workspaceId=" + workspace.id;
  } else {
    flowUrl = SharedPref.FLOW_EDITOR_URL + "/edit?flowId=" + $stateParams['flowId']+"&auth="+token.token.auth+ "&workspaceId="+ workspace.id;
  }
  $scope.flowUrl = $sce.trustAsResourceUrl(flowUrl);
  console.log("flow url is ", $scope.flowUrl);
  SharedPref.collapseNavbar();

  var element = angular.element(".flow-editor-iframe");
  sizeTheIframe();
  angular.element("window").on("resize.editor", function() {
    sizeTheIframe();
  });
});

