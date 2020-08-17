'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('BillingUpgradePlanCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade");
	  $scope.$shared = $shared;
	  $scope.isCurrentPlan = function(name) {
		if (name==='pay-as-you-go') {
			return true;
		}
		return false;
	  }
	$scope.canUpgrade = function(plan) {
		console.log("canUpgrade ", arguments);
		var info = $shared.planInfo;
		//var current = info.key_name;
		var current = 'pay-as-you-go';
		var plan1 = 'pay-as-you-go';
		var plan2 = 'starter';
		var plan3 = 'pro';
		var plan4 = 'ultimate';
		if (current === plan1 && plan === plan1) {
			return false;
		}
		if (current === plan2 && (plan === plan1 || plan === plan2)) {
			return false;
		}
		if (current === plan3 && (plan === plan1 || plan === plan2 || plan === plan3)) {
			return false;
		}
		if (current === plan4 && (plan === plan1 || plan === plan2 || plan === plan3 || plan === plan4)) {
			return false;
		}

		return true;

	}
	$scope.upgradePlan =  function(plan) {
		$state.go('billing-upgrade-submit', {"plan": plan});
	}

	  Backend.get("/plans").then(function(res) {
		console.log("plans ", res.data);
	  });
  });
