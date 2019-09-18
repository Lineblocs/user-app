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
				SharedPref.setAuthToken( token );
				Idle.watch();
		        $state.go('home', {});
			}).catch(function() {
				$scope.isLoading = false;
				$scope.couldNotLogin = true;
			})
			return;
		}
    }

    $scope.authenticate = function() {

    	var defer = $q.defer();

    	$timeout(function(){

    		defer.resolve();

    		$timeout(function(){
				Idle.watch();
    		   	$location.path('/dashboard/home');
    		}, 600);

    	}, 1100);

    	return defer.promise;

    }

  });
