'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('HomeCtrl', ['$scope', '$timeout', 'Backend', function ($scope, $timeout, Backend) {
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
		var color = Chart.helpers.color;
		Backend.get("/call/graphData").then(function(res) {
			var graph = res.data;
			console.log("graph data is ", graph);
			$scope.line = {
				legend: true,
				labels: graph.labels,
					data: [
				graph.data.inbound,
				graph.data.outbound
				//[7, 20, 10, 15, 17, 10, 27],
				//[6, 9, 22, 11, 13, 20, 27]
				],
				series: [
			'Inbound',
			'Outbound'
		],
				colours: [{ 
						fillColor: "#2b36ff",
						strokeColor: "#2b36ff",
						pointColor: "#2b36ff",
						pointStrokeColor: "#2b36ff", 
						pointHighlightFill: "#2b36ff", 
						pointHighlightStroke: "#2b36ff"
					},
					{
		        		fillColor: "#ffa01c",
						strokeColor: "#ffa01c",
						pointColor: "#ffa01c",
						pointStrokeColor: "#ffa01c", 
						pointHighlightFill: "#ffa01c",
						pointHighlightStroke: "#ffa01c"
					}
					],
options: {
	    legend: {
      display: true,
      position: 'right'
    },
					responsive: true,
						bezierCurve : false,
						datasetStroke: false,
						/*
						legendTemplate: '<ul>'
                  +'<% for (var i=0; i<datasets.length; i++) { %>'
					+'<li style=\"background-color:<%=datasets[i].fillColor%>\">'
                    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
                  +'</li>'
                +'<% } %>'
			  +'</ul>',
			  */
						pointDotRadius : 6,
						showTooltips: false,
				},
				onClick: function (points, evt) {
				console.log(points, evt);
				}

			};
		});
	}, 100);
    $scope.line2 = {
	    labels: ["JAN","FEB","MAR","APR","MAY","JUN"],
	          data: [
	      			[99, 180, 80, 140, 120, 220, 100],
	      			[50, 145, 200, 75, 50, 100, 50]
		],
	    colours: [{ 
				fillColor: "#2b36ff",
	            strokeColor: "#C172FF",
	            pointColor: "#fff",
	            pointStrokeColor: "#8F00FF",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "#8F00FF"
        	},
        	{
        		fillColor: "#ffa01c",
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