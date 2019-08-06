'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('docsCtrl', function ($scope, $interval, $mdToast, $document, $mdDialog) {
	 $scope.pie = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	      data : [300, 500, 100],
    	      colours: ['#FF4081','#F0AD4E','#00D554','#D9534F','#3faae3']
    };
    $scope.options1 = {
	    lineWidth: 8,
	    scaleColor: false,
	    size: 85,
	    lineCap: "square",
	    barColor: "#fb8c00",
	    trackColor: "#f9dcb8"
	};
	$scope.alert = '';
	  $scope.showAlert = function(ev) {
	    $mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.body))
	        .title('This is an alert title')
	        .content('You can specify some description text in here. This is your alert body.')
	        .ariaLabel('Alert Dialog Demo')
	        .ok('Got it!')
	        .targetEvent(ev)
	    );
	  };
});