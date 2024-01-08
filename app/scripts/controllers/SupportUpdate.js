'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportUpdateCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	$shared.updateTitle("Update Support ticket");
	$scope.$shared = $shared;
	$scope.values = {
		comment: ""
	};

	$scope.submit = function(form) {
		console.log("submitting support ticket form ", arguments);
		$scope.triedSubmit = true;
		var params = angular.copy( $scope.values );
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
		Backend.post("/supportTicket", params, true, true).then(function() {
			console.log("created ticket.");
			$mdToast.show(
			$mdToast.simple()
				.textContent('created ticket')
				.position(toastPosStr)
				.hideDelay(3000)
			);
			$state.go('support', {});
		$shared.endIsCreateLoading();
		});
	}
  });
