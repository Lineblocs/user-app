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

	$scope.values = {
		category: "",
		subject: "",
		comment: "",
		extension: "",
	};
	$scope.changeCategory = function(category) {
		$scope.values.category = category;
		console.log("changeCategory", category);
	}

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

	$scope.load = function() {
      	$shared.isLoading = true;
		Backend.get("/supportTicket/categories").then(function(res) {
			var data = res.data;
			$scope.categories = data;
          	$shared.endIsLoading();
		});
	}
	$scope.load();
  });
