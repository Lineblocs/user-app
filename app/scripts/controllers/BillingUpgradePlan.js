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

    $scope.canUpgrade = function(planRank) {
      console.log("canUpgrade ", arguments);
      const info = $shared.planInfo;
      const currentRank = info.rank;
      if (planRank >= currentRank) return false;
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

