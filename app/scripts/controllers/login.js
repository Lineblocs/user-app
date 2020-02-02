'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('LoginCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, Idle) {
	  SharedPref.updateTitle("Login");
	  SharedPref.processResult();
	$scope.triedSubmit = false;
	$scope.couldNotLogin = false;
	$scope.shouldSplash = false;
	$scope.isLoading = false;
	$scope.user = {
		email: "",
		password: ""
	};
    $scope.submit = function($event, loginForm) {
		$scope.triedSubmit = true;
		if (loginForm.$valid) {
			var data = angular.copy( $scope.user );
			$scope.isLoading = true;
			Backend.post("/jwt/authenticate", data).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				SharedPref.setAuthToken(token);
				SharedPref.setWorkspace(res.data.workspace);

				Idle.watch();
		        $state.go('dashboard-user-welcome', {});
			}).catch(function() {
				$scope.isLoading = false;
				$scope.couldNotLogin = true;
			})
			return;
		}
    }
	$scope.gotoRegister = function() {
		SharedPref.changingPage = true;
    	$state.go('register');
	}
	SharedPref.changingPage = false;
  });
