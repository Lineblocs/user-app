'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('cardCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.options1 = {
	    lineWidth: 12,
	    scaleColor: false,
	    size: 120,
	    lineCap: "square",
	    barColor: "#fb8c00",
	    trackColor: "#f9dcb8"
	};
	

}]);