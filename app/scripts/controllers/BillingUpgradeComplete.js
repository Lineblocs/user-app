'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingUpgradeCompleteCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $stateParams, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade Complete");
	  $scope.plan = null;
	  $scope.gotoDashboard = function() {
		  $state.go('dashboard');
	  }
		Backend.refreshWorkspaceData().then(function(res) {
				console.log("updated info");
						$mdToast.show(
						$mdToast.simple()
							.textContent('Plan upgraded')
							.position('top right')
							.hideDelay(3000)
						);
				$scope.plan = res.data[ 4 ];
				$shared.setWorkspace(res.data[ 5 ]);
					$shared.endIsCreateLoading();
            });

  });
