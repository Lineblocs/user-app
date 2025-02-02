'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HomeCtrl', ['$scope', '$timeout', 'Backend', '$shared', '$q', '$sce', '$state', function ($scope, $timeout, Backend, $shared, $q, $sce, $state) {
	  $shared.updateTitle("Dashboard");
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
	$scope.load = function() {
		$timeout(function () {
			var color = Chart.helpers.color;
			$shared.isLoading = true;
			Backend.get("/dashboard").then(function(res) {
				var graph = res.data[0];
				$shared.billInfo=  res.data[1];
				$shared.userInfo=  res.data[2];
				console.log("graph data is ", graph);
				$scope.callsMade = [
					{
						name: "Call 1",
						callerName: "XYZ caller",
						fromNumber: "9876543210",
						toNumber: "1234567890",
						exten: "Ext 1",
						img: "logo-icon.png",
						duration: "25m: 20sec",
						date:"1 days before",
					},
					// {
					// 	name: "Call 2",
					// 	callerName: "ABC caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 2",
					// 	img: "Logo_Final_Icon_White.png",
					// 	duration: "1h: 5m: 10sec",
					// 	date:"2 days before",
					// },
					// {
					// 	name: "Call 3",
					// 	callerName: "QWE caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 3",
					// 	img: "logo-icon.png",
					// 	duration: "5m: 40sec",
					// 	date:"3 days before",
					// }
				];
				$scope.callsIncoming = [{
					name: "Call 1",
					callerName: "XYZ caller",
					fromNumber: "9876543210",
					toNumber: "1234567890",
					exten: "Ext 1",
					img: "logo-icon.png",
					duration: "25m: 20sec",
					date:"1 days before",
				},
					// {
					// 	name: "Call 2",
					// 	callerName: "ABC caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 2",
					// 	img: "Logo_Final_Icon_White.png",
					// 	duration: "1h: 5m: 10sec",
					// 	date:"2 days before",
					// },
					// {
					// 	name: "Call 3",
					// 	callerName: "QWE caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 3",
					// 	img: "logo-icon.png",
					// 	duration: "5m: 40sec",
					// 	date:"3 days before",
					// }
				]
				$scope.DIDPurchased = [
					{
						DIDNumber:"8882229990",
						region: "Region Two"
					},
					// {
					// 	DIDNumber:"7766554433",
					// 	region: "ABC"
					// },
					// {
					// 	DIDNumber:"0011223344",
					// 	region: "QWE"
					// },
				];
				$scope.DIDRenewed = [
					{
						DIDNumber:"8882229990",
						region: "Region One"
					},
					// {
					// 	DIDNumber:"7766554433",
					// 	region: "ABC"
					// },
					// {
					// 	DIDNumber:"0011223344",
					// 	region: "QWE"
					// },
				];
				$scope.recordings = [
					{
						record: "value11",
						from: "7678687687",
						to: "6655441488"
					},
					// {
					// 	record: "value22",
					// 	from: "0099887767",
					// 	to: "98787"
					// },
					// {
					// 	record: "value33",
					// 	from: "8765432876",
					// 	to: "0941526790"
					// },
				];
				$shared.isLoading = false;
				$timeout(function(){
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
							fillColor: "#3f51b5",
							strokeColor: "#3f51b5",
							pointColor: "#3f51b5",
							pointStrokeColor: "#3f51b5",
							pointHighlightFill: "#3f51b5",
							pointHighlightStroke: "#3f51b5"
						},
						{
							fillColor: "#3D3D3D",
							strokeColor: "#3D3D3D",
							pointColor: "#3D3D3D",
							pointStrokeColor: "#3D3D3D",
							pointHighlightFill: "#3D3D3D",
							pointHighlightStroke: "#3D3D3D"
						}],
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
				}, 0);
			});
		}, 0);
	}

	$scope.getFeed = function(){
		Backend.get("/feed").then(function(res) {
			//$scope.feeds = res.data.items;
			$scope.feeds = res.data.items.map(function(obj) {
				if(obj.event_type === 'recordings' || obj.s3_url !== undefined){
					obj['public_url'] = $sce.trustAsResourceUrl(obj.s3_url);
					
				}
				return obj;
				});
		});
	}
	$scope.gotorecoring = function() {
		$state.go('recordings');
	}
	$scope.gotodid = function(feed) {
		// $state.go('dids/my-numbers/'+feed.public_id+'/edit');
		$state.go('my-numbers-edit', { numberId: feed.public_id });
	}
	$scope.reloadGraph = function() {
		console.log("reloadGraph called..");
		$scope.load();
	}
	$scope.load();
	$scope.getFeed();
}]);