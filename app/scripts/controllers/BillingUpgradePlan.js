'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingUpgradePlanCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade");
	  $scope.$shared = $shared;
    $scope.plans = '';

    $scope.canUpgrade = function(plan) {
      const info = $shared.planInfo;
      const currentRank = $scope.plans.find((plan) => plan.key_name === info.key_name).rank;
      if (plan.rank >= currentRank) return false;
      return true;
    }

    $scope.upgradePlan =  function(plan) {
      $state.go('billing-upgrade-submit', {"plan": plan});
    }

    Backend.get("/getServicePlans").then(function(res) {
      console.log("getServicePlans ", res.data);
      $scope.plans = res.data;
    });
});

