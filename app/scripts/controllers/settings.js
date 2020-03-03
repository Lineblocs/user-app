'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('SettingsCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast) {
	  $shared.updateTitle("Settings");
	  $scope.triedSubmit = false;
	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: ""
	};
	$scope.changeCountry = function(country) {
		console.log("changeCountry ", country);
	}
    $scope.submitSettings = function($event, settingsForm) {
		$scope.triedSubmit = true;
		if (settingsForm.$valid) {
			var data = {};
			data['first_name'] = $scope.user.first_name;
			data['last_name'] = $scope.user.last_name;
			data['email'] = $scope.user.email;
			$shared.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
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
   $scope.submitPersonal = function($event, personalForm) {
		$scope.triedSubmit = true;
		console.log("submitPersonal ", personalForm);
		if (personalForm.$valid) {
			var data = {};
			data['address_line_1'] =$scope.user.address_line_1;
			data['address_line_2'] =$scope.user.address_line_2;
			data['postal_code'] =$scope.user.postal_code;
			data['state'] =$scope.user.state;
			data['city'] =$scope.user.city;
			data['country'] =$scope.user.country;
			$shared.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
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
			$shared.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
				var token = res.data;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your passwords')
						.position("top right")
						.hideDelay(3000)
					);
				$shared.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}
	$shared.isLoading = true;
	Backend.get("/self").then(function(res) {
		$scope.user = res.data;
		console.log("user is ", $scope.user);
		$shared.endIsLoading();
	});
  });
