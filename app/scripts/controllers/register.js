'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('RegisterCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state) {
	  $scope.triedSubmit = false;
	  $scope.passwordsDontMatch = false;
	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: ""
	};
    $scope.submit = function($event, registerForm) {
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
				var token = res.data;
				SharedPref.setAuthToken( token );
		        $state.go('dashboard-user-welcome', {});
			});
			return;
		}
      	return false;

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
