'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CancelSubscriptionCtrl', function ($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
  $shared.updateTitle("Cancel Subscription");
  $shared.endIsCreateLoading();
  $scope.cancelSubscription = function ($event) {

    const confirm = $mdDialog.confirm()
      .title('Are you sure you want to cancel your subscription?')
      .textContent('You will not be able to use Lineblocs until you subscribe again.')
      .ariaLabel('Cancel Subscription')
      .targetEvent($event)
      .ok('Confirm')
      .cancel('Dismiss');
    $mdDialog.show(confirm).then(function () {
      $shared.isCreateLoading = true;
      Backend.post("/billing/discontinue").then(function (res) {
        $mdToast.show($mdToast.simple().textContent('Subscription cancelled').position("top right").hideDelay(3000));
        $state.go('billing');
        $shared.endIsCreateLoading();
      });
    });
  }
});
