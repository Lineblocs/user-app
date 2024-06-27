'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportUpdateCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window, $stateParams, $sce) {
	$shared.updateTitle("Update Support ticket");
	$scope.$shared = $shared;
	$scope.values = {
		comment: ""
	};

	$scope.newUpdate = {
		comment: ""
	}

	$scope.submitUpdate = function(updateForm) {
		console.log("submitting support ticket form ", arguments);
		$scope.triedSubmit = true;
		var params = angular.copy( $scope.newUpdate );
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
          .filter(function(pos) { return toastPos[pos]; })
          .join(' ');
		console.log('params are ', params);
		var url = "/supportTicket/" + $scope.ticket.public_id +"/update";
		Backend.post(url, params, true, true).then(function() {
			console.log("sent support ticket update.");
			$mdToast.show(
			$mdToast.simple()
				.textContent('update submitted successfully')
				.position(toastPosStr)
				.hideDelay(3000)
			);
			//$state.go('support', {});
		$shared.endIsCreateLoading();
		// reload data
		load();
			});
	}
	function load() {
		var url = "/supportTicket/" + $stateParams['ticketId'];
		console.log("loading data")
		Backend.get(url).then(function(res) {
			console.log("ticket loaded.", res);
			var ticket = res.data;
			ticket.updates = ticket.updates.map((obj) => {
				obj.commentHTML = $sce.trustAsHtml(obj.comment);
				return obj;
			});
			$scope.ticket = ticket;
		});
	}
	load();
  });
