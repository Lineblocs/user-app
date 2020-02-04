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

	function finishLogin(token, workspace) {
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				SharedPref.setAuthToken(token);
				SharedPref.setWorkspace(workspace);
				Idle.watch();
		        $state.go('dashboard-user-welcome', {});
	}
    $scope.submit = function($event, loginForm) {
		$scope.triedSubmit = true;
		if (loginForm.$valid) {
			var data = angular.copy( $scope.user );
			$scope.isLoading = true;
			Backend.post("/jwt/authenticate", data).then(function( res ) {
				var token = res.data;
				finishLogin(token, res.data.workspace);
			}).catch(function() {
				$scope.isLoading = false;
				$scope.couldNotLogin = true;
			})
			return;
		}
    }
	$scope.gotoRegister = function() {
		SharedPref.changingPage = true;
		SharedPref.scrollToTop();
    	$state.go('register');
	}
	$scope.gotoForgot = function() {
		SharedPref.changingPage = true;
		SharedPref.scrollToTop();
		$state.go('forgot');
	}

	$scope.startThirdPartyLogin = function(email, name, avatar) {
		var data = {};
		data['email'] = email;
		data['name'] = name;
		data['avatar'] = avatar;

		Backend.post("/thirdPartyLogin", data).then(function( res ) {
			if ( res.data.confirmed ) {
				finishLogin(res.data.token, res.data.workspace);
				return;
			}
    		$state.go('register', {
				"hasData": "1",
				"userId": res.data.userId,
				"token": res.data.token
			});
		});
	}
	SharedPref.changingPage = false;
  });
