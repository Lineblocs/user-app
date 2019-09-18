'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('MyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, SharedPref) {
	  SharedPref.updateTitle("My Numbers");
  $scope.settings = {
    page: 0
  };
  $scope.numbers = [];
  $scope.load = function() {
      SharedPref.isLoading = true;
    Backend.get("/did/listNumbers", $scope.settings).then(function(res) {
      $scope.numbers = res.data.data;
      SharedPref.endIsLoading();
    })
  }
  $scope.buyNumber = function() {
    $state.go('buy-numbers', {});
  }
  $scope.editNumber = function(number) {
    $state.go('my-numbers-edit', {numberId: number.id});
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('If you delete this number you will not be able to call it anymore')
          .ariaLabel('Delete number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      Backend.delete("/did/deleteNumber/" + number.id).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Number deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          $scope.load();

      })
    }, function() {
    });
  }

  $scope.load();
});

