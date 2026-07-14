'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:ReactivateSubscriptionCtrl
 * @description
 * # ReactivateSubscriptionCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BillingReactivateSubscriptionCtrl', function ($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
  $shared.updateTitle("Reactivate Subscription");
  $scope.reactivateSubscription = false;
  $shared.endAllLoading();
  $scope.reactivateSubscription = function ($event) {
    $scope.reactivateSubscription = true;
    const confirm = $mdDialog.confirm()
      .title('Are you sure you want to reactivate your subscription?')
      .textContent('You will be able to use Lineblocs once your subscription is reactivated.')
      .ariaLabel('Reactivate Subscription')
      .targetEvent($event)
      .ok('Confirm')
      .cancel('Dismiss');
    $mdDialog.show(confirm).then(function () {
      $shared.isCreateLoading = true;
      Backend.post("/billingReactivate").then(function (res) {
        $mdToast.show($mdToast.simple().textContent('Subscription reactivated').position("top right").hideDelay(3000));
        $scope.reactivateSubscription = false;
        $shared.endIsCreateLoading();
      });
    });
  }
  $scope.goBilling = function() {
    $state.go('billing');
  }
});
