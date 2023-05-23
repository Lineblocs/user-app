'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('FlowEditorCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $stateParams, $sce, $window) {
	  $shared.updateTitle("Flow Editor");
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
  var token = $shared.getAuthToken();
  var workspace = $shared.getWorkspace();
  if ($stateParams['flowId'] === "new" ) {
    flowUrl = $shared.FLOW_EDITOR_URL+"/create?auth="+token.token.auth + "&workspaceId=" + workspace.id + "&mode=" + $window.localStorage.getItem("THEME");
  } else {
    flowUrl = $shared.FLOW_EDITOR_URL + "/edit?flowId=" + $stateParams['flowId']+"&auth="+token.token.auth+ "&workspaceId="+ workspace.id + "&mode=" + $window.localStorage.getItem("THEME");
  }
  var adminToken = localStorage.getItem("ADMIN_TOKEN");
  if (adminToken) {
      flowUrl += "&admin=" +  adminToken;
  }

  $scope.flowUrl = $sce.trustAsResourceUrl(flowUrl);
  console.log("flow url is ", $scope.flowUrl);
  $shared.collapseNavbar();

  var element = angular.element(".flow-editor-iframe");
  sizeTheIframe();
  angular.element("window").on("resize.editor", function() {
    sizeTheIframe();
  });
});

