'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('HomeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.options1 = {
	    lineWidth: 8,
	    scaleColor: false,
	    size: 85,
	    lineCap: "square",
	    barColor: "#fb8c00",
	    trackColor: "#f9dcb8"
	};
	$scope.options2 = {
	    lineWidth: 8,
        scaleColor: false,
        size: 85,
        lineCap: "square",
        barColor: "#00D554",
        trackColor: "#c7f9db"
	};
	$scope.options3 = {
	    lineWidth: 8,
        scaleColor: false,
        size: 85,
        lineCap: "square",
        barColor: "#F800FC",
        trackColor: "#F5E5F5"
	};

	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	if ($(window).width()<600) {		
		$( '.mdl-grid' ).removeAttr('dragula');
	};
	$timeout(function () {
		$scope.line = {
		    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		          data: [
		      [7, 20, 10, 15, 17, 10, 27],
		      [6, 9, 22, 11, 13, 20, 27]
		    ],
		    colours: [{ 
					fillColor: "#FFA3FD",
		            strokeColor: "#FFA3FD",
		            pointColor: "#fff",
		            pointStrokeColor: "#FFA3FD",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "#FFA3FD",
	        	},
	        	{
	        		fillColor: "#F800FC",
		            strokeColor: "#F800FC",
		            pointColor: "#fff",
		            pointStrokeColor: "#F800FC",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "#F800FC",
	        	}
	        	],
		    options: {
		    	responsive: true,
		            bezierCurve : false,
		            datasetStroke: false,
		            legendTemplate: false,
		            pointDotRadius : 6,
		            showTooltips: false
		    },
		    onClick: function (points, evt) {
		      console.log(points, evt);
		    }

	    };
	}, 100);
    $scope.line2 = {
	    labels: ["JAN","FEB","MAR","APR","MAY","JUN"],
	          data: [
	      [99, 180, 80, 140, 120, 220, 100],
	      [50, 145, 200, 75, 50, 100, 50]
	    ],
	    colours: [{ 
				fillColor: "rgba(0,0,0, 0)",
	            strokeColor: "#C172FF",
	            pointColor: "#fff",
	            pointStrokeColor: "#8F00FF",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "#8F00FF"
        	},
        	{
        		fillColor: "rgba(0,0,0, 0)",
	            strokeColor: "#FFB53A",
	            pointColor: "#fff",
	            pointStrokeColor: "#FF8300",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "#FF8300"
        	}
        	],
	    options: {
	    	responsive: true,
            bezierCurve : false,
            datasetStroke: false,
            legendTemplate: false,
            pointDotRadius : 9,
            pointDotStrokeWidth : 3,
            datasetStrokeWidth : 3
	    },
	    onClick: function (points, evt) {
	      console.log(points, evt);
	    }

    };

}]);