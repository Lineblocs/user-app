'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q) {
    $shared.updateTitle("Buy Numbers");
    $scope.countries = [];
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
  /*
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
  */
  $scope.settings = {
    country: "",
    region: "",
    pattern: "",
    rate_center: ""
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

  $scope.load = function() {
    $scope.listCountries().then(function() {
      $shared.endIsLoading();
    });
  }
  $scope.fetch =  function(event, didForm) {
		$scope.triedSubmit = true;
		if (!didForm.$valid) {
        return;
    }
    var data = {};
    //data['region'] = $scope.settings['region'];
    data['region'] = $scope.settings['region']['code'];
    data['rate_center'] = $scope.settings['rate_center'];
    //data['prefix'] = $scope.settings['pattern'];
    data['prefix'] = "";
    data['country_iso'] = $scope.settings['country']['iso'];
    $shared.isCreateLoading = true;
    Backend.get("/did/available", { "params": data }).then(function(res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
      $shared.endIsCreateLoading();
    });
  }
  $scope.buyNumber = function($event, number) {
        $shared.scrollTop();
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
        params['api_number'] = number.api_number;
        params['number'] = number.number;
        params['region'] = number.region;
        params['monthly_cost'] = number.monthly_cost;
        params['provider'] = number.provider;
        params['country'] = number.country;
        params['features'] = number.features.join(",");
        $shared.isCreateLoading = true;
        $shared.scrollTop();
        Backend.post("/did/saveNumber", params).then(function(res) {
          Backend.get("/did/numberData/" + res.headers("X-Number-ID")).then(function(res) {
              var number = res.data;
              $shared.endIsCreateLoading();
              purchaseConfirm($event, number);
          });
        }, function(res) {
          console.log("res is: ", res);
          if (res.status === 400) {
            var data = res.data;
            $shared.showError("Error", data.message);
          }
        });
    }, function() {
    });
  }
  $scope.changeCountry = function(country) {
    console.log("changeCountry ", country);
    $scope.settings.country = country;
    $scope.regions = [];
    $scope.listRegions();
  }
 $scope.changeRegion = function(region) {
    console.log("changeRegion ", region);
    $scope.settings.region = region;
    $scope.listRateCenters();
  }
  $scope.changeRateCenter = function(rateCenter) {
    console.log("changeRateCenter ", rateCenter);
    $scope.settings.rate_center = rateCenter;
  }

$scope.listCountries = function() {
    return $q(function(resolve, reject) {
        Backend.get("/getCountries").then(function(res) { 
        console.log("got countries ", res.data);
        $scope.countries = res.data;
        resolve();
      });
    });

  }

  $scope.listRegions = function() {
    Backend.get("/getRegions?countryId=" + $scope.settings.country.id).then(function(res) {
      console.log("got regions ", res.data);
      $scope.regions = res.data;
    })

  }
  $scope.listRateCenters = function() {
    Backend.get("/getRateCenters?countryId=" + $scope.settings.country.id+ "&regionId=" + $scope.settings.region.id).then(function(res) {
      console.log("got rate centers ", res.data);
      $scope.rateCenters = res.data;
    })

  }


    $scope.load();
});

