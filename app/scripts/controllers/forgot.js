'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('ForgotCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle) {
	  $shared.updateTitle("Forgot Password");
	$scope.triedSubmit = false;
	$scope.isLoading = false;
	$scope.user = {
		email: "",
	};
    $scope.submit = function($event, forgotForm) {
		$scope.triedSubmit = true;
		if (forgotForm.$valid) {
			var data = angular.copy( $scope.user );
			$scope.isLoading = true;
			var resetMsg = ""
			Backend.post("/forgot", data, true).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
				$shared.showMsg('Reset instructions', 'We have sent you instructions to reset your password');
/*
					$mdToast.show(
					$mdToast.simple()
						.textContent('Reset instructions sent to email..')
						.position("top right")
						.hideDelay(3000)
					);
					*/
			}).catch(function() {
				$scope.isLoading = false;
				$scope.errorMsg = "No such user exists.";
			})
			return;
		}
	}
	$scope.gotoLogin= function() {
		$shared.changingPage = true;
		$shared.scrollToTop();
    	$state.go('login');
	}
	$shared.changingPage = false;
  });
