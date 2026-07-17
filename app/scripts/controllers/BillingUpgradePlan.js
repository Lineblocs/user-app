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

    $scope.gotoDashboard = function() {
		  $state.go('dashboard');
	  }

    $scope.getCurrentPlan = function() {
      const info = $shared.planInfo;
      if ($scope.plans && $scope.plans.length > 0) {
        return $scope.plans.find((plan) => plan.key_name === info.key_name);
      }

      return null;
    }

    $scope.isUpgradePlanned = function(plan) {
      const subscription = $scope.subscription;
      if (subscription && subscription.scheduled_plan_id) {
        return true;
      }

      return false;
    }
    $scope.canUpgrade = function(plan) {
      const currentPlan = $scope.currentPlan;
      console.log('currentPlan ', currentPlan);
      if (!currentPlan) return false;
      if (plan.rank <= currentPlan.rank || currentPlan.id === plan.id) return false;
      return true;
    }

    $scope.upgradePlan =  function(plan) {
      $state.go('billing-upgrade-submit', {"plan": plan});
    }

    $scope.load = function () {
      $q.all([
        Backend.get("/getServicePlans"),
        Backend.get("/billing"),
      ]).then(function(res) {
        console.log("getServicePlans ", res[0].data);
        $scope.plans = res[0].data.plans;
        $scope.subscription = res[1].data[5];
        $scope.currentPlan = $scope.getCurrentPlan();
        $shared.endAllLoading();
      });
    };

    $scope.load();
});

