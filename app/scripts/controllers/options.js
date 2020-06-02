'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('WorkspaceOptionsCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast) {
	  $shared.updateTitle("Workspace Options");
	  $scope.triedSubmit = false;
	  $scope.ui = {
	  };
	$scope.workspace = {
		byo_enabled: null,
		outbound_macro_id: null
	};
    $scope.submitSettings = function($event, settingsForm) {
		$scope.triedSubmit = true;
		console.log("submit ", arguments);
		if (settingsForm.$valid) {
			var data = {};
			data['byo_enabled'] = $scope.workspace.byo_enabled;
			data['outbound_macro_id'] = $scope.workspace.outbound_macro_id;
			Backend.post("/updateWorkspace2", data).then(function( res ) {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your info')
						.position("top right")
						.hideDelay(3000)
					);
					$shared.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}
	$scope.changeOutbound = function(value) {
		console.log("changeFunction  ", arguments);
		$scope.workspace.outbound_macro_id = value;
	}
	$shared.isLoading = true;
	$q.all([
		Backend.get("/workspace"),
		Backend.get("/function/listFunctions?all=1")
	]).then(function(res) {
		$scope.workspace = res[0].data;
		console.log("workspace is ", $scope.workspace);
		$scope.functions = res[1].data.data;
		$shared.endIsLoading();
	});
  });
