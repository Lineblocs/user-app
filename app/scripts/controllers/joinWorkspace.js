'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('JoinWorkspaceCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $stateParams, Idle) {
	  $shared.updateTitle("Join Workspace");
	  var hash = $stateParams['hash'];
	  $scope.passwordSet = false;
	  $scope.values = {
		  "first_name": "",
		  "last_name": "",
		  "password": "",
		  "password2": ""
	  };
	function finishLogin(token, workspace) {
		console.log("finishLogin ", arguments);
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				$shared.isAdmin = token.isAdmin;

				$shared.setAuthToken(token);
				$shared.setWorkspace(workspace);
				Idle.watch();
				$state.go('dashboard-user-welcome', {});
	}

	$scope.submit =function($event, inviteForm) {
		if (!inviteForm.$valid) {
			$scope.triedSubmit = true;
			$scope.errorMsg = "Please fill in all fields below..";
			return;
		}
		if ($scope.values.password !== $scope.values.password2) {
			$scope.errorMsg = "Passwords don't match";
			return;


		}
		var data = {
			"hash": $stateParams['hash'],
			"first_name": $scope.values['first_name'],
			"last_name": $scope.values['last_name'],
			"password": $scope.values['password']
		};
		Backend.post("/submitJoinWorkspace", data).then(function(res) {
			$scope.isLoading = true;
			var token = res.data;
			console.log("token is ", token);
			finishLogin(token, res.data.workspace);
		});
	}
	$scope.acceptInvite = function() {
			var data = {
			"hash": $stateParams['hash']
		};
			$scope.isLoading = true;
		Backend.post("/acceptWorkspaceInvite", data).then(function(res) {
			var token = res.data;
				finishLogin(token, res.data.workspace);
		});
	}

	  Backend.get("/fetchWorkspaceInfo?hash=" +hash).then(function(res) {
		  $scope.info = res.data;
		  if ( $scope.info.user.needs_password_set ) {
			  $scope.passwordSet = true;
		  }
	  });
  });
