'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('RegisterCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast) {
	  $scope.triedSubmit = false;
	  $scope.passwordsDontMatch = false;
	  $scope.shouldSplash = false;
	  $scope.didVerifyCall = false;
	  $scope.step = 1;
	  $scope.userId = null;
	  $scope.token = null;
	  $scope.invalidCode =false; 
	  $scope.invalidNumber =false; 
	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: ""
	};
	$scope.verify1 = {
		mobile_number: ""
	};
	$scope.verify2 = {
		confirmation_code: ""
	};

    $scope.submit = function($event, registerForm) {
		console.log("called submit");
		$scope.triedSubmit = true;
		if ($scope.user.password !== $scope.user.password2) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (registerForm.$valid) {
			var data = angular.copy( $scope.user );
			Backend.post("/register", data).then(function( res ) {
				$scope.token = res.data.token;
				$scope.userId = res.data.userId;
				$scope.step = 2;
			});
			return;
		}
      	return false;

	}

	$scope.submitVerify1Form = function($event, verify1Form) {
		console.log("called submitVerify1Form");
		$scope.triedSubmit = true;
		if (verify1Form.$valid) {
			var data = angular.copy( $scope.verify1 );
			data.userId = $scope.userId;
			Backend.post("/registerSendVerify", data).then(function( res ) {
				var data = res.data;
				if (res.data.valid) {
					$scope.didVerifyCall = true;
					$scope.invalidNumber = false;
					return;
				}
				$scope.invalidNumber = true;
				//$scope.showNumberInvalid = true;
			});
			return;
		}
		return false;
	}

	$scope.submitVerify2Form = function($event, verify2Form) {
		console.log("called submitVerify2Form");
		$scope.triedSubmit = true;
		if (verify2Form.$valid) {
			var data = angular.copy( $scope.verify2 );
			data.userId = $scope.userId;
			Backend.post("/registerVerify", data).then(function( res ) {
				var isValid = res.data.isValid;
				if (isValid) {
					$scope.shouldSplash = true;
					SharedPref.setAuthToken( $scope.token );
					var data = { "userId": $scope.userId };
					$scope.invalidCode = false;
					Backend.post("/userSpinup", data).then(function( res ) {
						var data = res.data;
						if ( data.success ) {
							$state.go('dashboard-user-welcome', {});
							return;
						}
						$mdToast.show(
						$mdToast.simple()
							.textContent('Error occured while creating your account. please account support')
							.position("top right")
							.hideDelay(1000*10)
						);
					});
				} else {
					$scope.invalidCode = true;
				}
			});
			return;
		}
		return false;
	}

	$scope.recall = function() {
		var data = angular.copy( $scope.verify1 );
		data.userId = $scope.userId;
		Backend.post("/registerSendVerify", data).then(function( res ) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('You will be called shortly.')
            .position("top right")
            .hideDelay(3000)
		);
		   });
	}
    $scope.authenticate = function() {

    	var defer = $q.defer();

    	$timeout(function(){

    		defer.resolve();

    		$timeout(function(){
    		   	$location.path('/dashboard/home');
    		}, 600);

    	}, 1100);

    	return defer.promise;

    }

  });
