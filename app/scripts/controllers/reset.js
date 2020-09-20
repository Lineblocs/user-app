'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('ResetCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle) {
	  $shared.updateTitle("Reset");
	$scope.triedSubmit = false;
	$scope.isLoading = false;
	$scope.couldNotReset = false;
	$scope.couldNotResetMsg = "";
	var token = $location.search()['token'];
	$scope.user = {
		email: "",
		password: "",
		confirmPassword: "",
		token: token
	};
	console.log("reset params are ", $scope.user);
    $scope.submit = function($event, resetForm) {
		$scope.triedSubmit = true;
		if ($scope.user.password !== $scope.user.confirmPassword) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (resetForm.$valid) {
			var data = {};
			data.email = $scope.user.email;
			data.token = $scope.user.token;
			data.password = $scope.user.password;
			data.password_confirmation = $scope.user.confirmPassword;
			$scope.isLoading = true;
			console.log("requesting reset ", data);
			$scope.couldNotReset = false;
			$scope.couldNotResetMsg = "";
			Backend.post("/reset", data, true).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
				/*
					$mdToast.show(
					$mdToast.simple()
						.textContent('Password was reset successfully.')
						.position("top right")
						.hideDelay(3000)
					);
					*/
				
				$shared.showMsg('Password reset', 'You have successfully reset your password.').then(function()  {
					$state.go('login', {});
				});
			}).catch(function(res) {
				console.log("error reply is ", res);
				$scope.couldNotReset = true;
				$scope.couldNotResetMsg = res.data.message;

				$scope.isLoading = false;
			})
			return;
		}
    }
  });
