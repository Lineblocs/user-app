'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportCtrl', function($scope, $location, $timeout, $stateParams, $q, Backend, pagination, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Support");
		$scope.$stateParams = $stateParams;
		$scope.pagination = pagination;
	  $scope.$shared = $shared;
	  $scope.supportTickets = [];

	function loadData(createLoading) {
		console.log("support load data started")
		if (createLoading) {
			$shared.isCreateLoading =true;
		} else {
			$shared.isLoading =true;
		}

		return $q(function(resolve, reject) {
			console.log("loading support tickets");
			Backend.get("/supportTicket/list").then(function(res) {
				console.log("finished loading..");
				//$scope.supportTickets = res.data.data;
				if (createLoading) {
					$shared.endIsCreateLoading();
				} else {
					$shared.endIsLoading();
				}
				console.log("support tickets ", $scope.supportTickets);
				resolve();
			}, reject);
		});
	}
	$scope.createSupportTicket = function() {
    	$state.go('support-create', {});
	}
	$scope.editSupportTicket = function(ticket) {
		$state.go('support-edit', {ticketId: ticket.public_id});
	}
	loadData(false);
  });
