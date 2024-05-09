'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingFixPaypalAgreementCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade");
	  $scope.$shared = $shared;
    $scope.plans = '';

    // TODO implement this
    $scope.createNewAgreement = function(plan) {
      return true;
    }

    Backend.get("/getServicePlans").then(function(res) {
      console.log("getServicePlans ", res.data);
      $scope.plans = res.data;
    });
});

