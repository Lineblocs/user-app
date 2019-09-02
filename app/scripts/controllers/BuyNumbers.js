'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, SharedPref) {
	  SharedPref.updateTitle("Buy Numbers");
    function DialogController($scope, $mdDialog, number) {
      $scope.number = number;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.gotoSettings = function() {
        $mdDialog.hide("");
        $state.go('my-numbers-edit', { numberId: number.id });
    }
  }
  $scope.countries = [
    {
       iso: 'CA',
       name: 'Canada'
    },
    {
       iso: 'US',
       name: 'United States'
    }
  ];
  $scope.settings = {
    country: "",
    region: "",
    pattern: ""
  };
  $scope.numbers = [];
  $scope.didFetch = false;

  function purchaseConfirm(ev, number) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/purchase-did-confirm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "number": number
      }
    })
    .then(function() {
    }, function() {
    });
  };

  $scope.fetch =  function() {
    var data = {};
    //data['region'] = $scope.settings['region'];
    data['region'] = null;
    data['prefix'] = $scope.settings['pattern'];
    data['country_iso'] = $scope.settings['country']['iso'];
    SharedPref.isCreateLoading = true;
    Backend.get("/did/available", { "params": data }).then(function(res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
      SharedPref.isCreateLoading = false;
    });
  }
  $scope.buyNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to purchase number "' + number.number + '"?')
          .textContent('this number will cost you ' + number.monthly_cost + ' monthly. you may unrent this number at any time ')
          .ariaLabel('Buy number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        var params = {};
        params['number'] = number.number;
        params['region'] = number.region;
        params['monthly_cost'] = number.monthly_cost;
        Backend.post("/did/saveNumber", params).then(function(res) {
          Backend.get("/did/numberData/" + res.headers("X-Number-ID")).then(function(res) {
              var number = res.data;
              purchaseConfirm($event, number);
          });
        }, function(res) {
          console.log("res is: ", res);
          if (res.status === 400) {
            var data = res.data;
            SharedPref.showError("Error", data.message);
          }
        });
    }, function() {
    });
  }
  $scope.changeCountry = function(country) {
    console.log("changeCountry ", country);
    $scope.settings.country = country;
  }

});

