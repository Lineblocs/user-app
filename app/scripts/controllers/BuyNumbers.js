'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog) {
  $scope.countries = [
    'Canada'
  ];
  $scope.settings = {
    country: "",
    region: "",
    pattern: ""
  };
  $scope.numbers = [];
  $scope.didFetch = false;
  $scope.fetch =  function() {
    Backend.get("/did/available", $scope.settings).then(function(res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
    });
  }
  $scope.buyNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to purchase number "' + number + '"?')
          .textContent('this number will cost you ' + number.monthly_cost + ' monthly. you may unrent this number at any time ')
          .ariaLabel('Buy number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        var params = {};
        params['number'] = number;
        Backend.post("/did/saveNumber", params).then(function(res) {

        });
    }, function() {
    });
  }
  $scope.changeCountry = function(country) {
    console.log("changeCountry ", country);
    $scope.settings.country = country;
  }

});

