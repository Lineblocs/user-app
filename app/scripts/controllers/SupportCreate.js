'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportCreateCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	$shared.updateTitle("Create Support ticket");
	$scope.$shared = $shared;
	$scope.categories = [
		{
			"id": 1,
			"name": "Phone connection issues"
		},
		{
			"id": 2,
			"name": "Audio quality issues"
		},
	];
	$scope.values = {
		category: "",
		subject: "",
		message: "",
		extension: "",
	};
	$scope.changeCategory = function(category) {
		$scope.values.category = category;
		console.log("changeCategory", category);
	}

	$scope.submit = function(form) {
		console.log("submitting support ticket form ", arguments);
	
	}
  });
