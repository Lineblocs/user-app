'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
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
			Backend.post("/forgot", data).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Reset instructions sent to email..')
						.position("top right")
						.hideDelay(3000)
					);
			}).catch(function() {
				$scope.isLoading = false;
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
