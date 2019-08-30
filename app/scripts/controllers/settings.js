'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('SettingsCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast) {
	  SharedPref.updateTitle("Settings");
	  $scope.triedSubmit = false;
	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: ""
	};
    $scope.submitSettings = function($event, settingsForm) {
		$scope.triedSubmit = true;
		if (settingsForm.$valid) {
			var data = {};
			data['first_name'] = $scope.user.first_name;
			data['last_name'] = $scope.user.last_name;
			data['email'] = $scope.user.email;
			SharedPref.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
					SharedPref.isCreateLoading = false;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your info')
						.position("top right")
						.hideDelay(3000)
					);
			});
			return;
		}
      	return false;

	}
    $scope.submitPasswords = function($event, passwordsForm) {
		$scope.triedSubmit = true;
		if ($scope.user.password !== $scope.user.password2) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (passwordsForm.$valid) {
			var data = {};
			data['password'] = $scope.user.password;
			SharedPref.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
				SharedPref.isCreateLoading = false;
				var token = res.data;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your passwords')
						.position("top right")
						.hideDelay(3000)
					);
			});
			return;
		}
      	return false;

	}
	SharedPref.isLoading = true;
	Backend.get("/self").then(function(res) {
		SharedPref.isLoading = false;
		$scope.user = res.data;
		console.log("user is ", $scope.user);
	});
  });
