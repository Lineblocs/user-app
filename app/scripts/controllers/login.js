'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('LoginCtrl', function($scope, $location, $timeout, $q) {

    $scope.submit = function() {

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
