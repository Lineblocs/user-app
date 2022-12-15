'use strict';
/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, $stateParams) {
  $shared.updateTitle("Buy Numbers");
  $scope.countries = [];
  $scope.state = "SEARCHING";
  $scope.inDialog = false;
  $scope.rcSearch = {
    isDisabled: false,
    noCache: true,
    selectedItem: null,
  };
  $scope.rcFaxSearch = {
    isDisabled: false,
    noCache: true,
    selectedItem: null,
  };

  function DialogController($scope, inDialog, onSuccess, onError, $mdDialog, number) {
    $scope.number = number;
    $scope.cancel = function () {
      $mdDialog.cancel();

    };
    $scope.gotoSettings = function () {
      $mdDialog.hide("");
      $state.go('my-numbers-edit', {
        numberId: number.public_id
      });
    }
  }

  $scope.settings = {
    country: "",
    region: "",
    pattern: "",
    rate_center: "",
    showMoreOptions: false,
    number_for: "",
    number_type: "local",
    vanity_prefix: "8**",
    vanity_pattern: ""
  };
  $scope.numbers = [];
  $scope.didFetch = false;
  console.log("state params are ", $stateParams);
  if ($stateParams['type']) {
    $scope.settings.number_for = $stateParams['type'];
  }

  function purchaseConfirm(ev, number) {
    if ($scope.inDialog) {
      var confirm = window.confirm("Are you sure ?");
      if (confirm) {
        $scope.$emit("Created", id)
        onSuccess(id);
        return;
      }
      return;
    }
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/dialogs/purchase-did-confirm.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        skipHide: true,
        fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        locals: {
          "number": number,
          "inDialog": $scope.inDialog,
          "onSuccess": function (id) {
            $scope.$emit("Created", id)
          },
          "onError": function () {
            $shared.showError("Purchase Error");
          }
        }
      })
      .then(function () {}, function () {});
  };

  $scope.load = function () {
    $scope.listCountries().then(function () {
      $shared.endIsLoading();
    });
  }
  $scope.fetch = function (event, didForm) {
    $scope.triedSubmit = true;
    if (!didForm.$valid) {
      return;
    }
    var data = {};
    //data['region'] = $scope.settings['region'];
    data['region'] = $scope.settings['region']['code'];
    if ($scope.settings.showMoreOptions) {
      data['rate_center'] = $scope.settings['rate_center'];
    }

    data['prefix'] = $scope.settings['pattern'];
    //data['prefix'] = "";
    data['country_iso'] = $scope.settings['country']['iso'];
    data['number_for'] = $scope.settings['number_for'];
    data['number_type'] = $scope.settings['number_type'];
    data['vanity_prefix'] = $scope.settings['vanity_prefix'];
    data['vanity_pattern'] = $scope.settings['vanity_pattern'];
    $shared.isCreateLoading = true;
    Backend.get("/did/available", {
      "params": data
    }).then(function (res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
      $scope.state = "SEARCHED";
      $shared.endIsCreateLoading();
    });
  }

  $scope.confirmNumberTOS = function (number) {
    var confirm = $mdDialog.confirm()
      .title('Vanity Number Notice')
      .textContent("Please note that because this is a vanity number it won't be available right away. This number will be listed on your account after you buy it however it will not be available for use until our upstream carrier fulfills the request")
      .ariaLabel('Agree')
      .targetEvent($event)
      .ok('Please Continue')
      .cancel('Exit');


  }

  function buyVanityNumber($event, number) {
    var confirm = $mdDialog.confirm()
      .title('Vanity Number Notice')
      .textContent("Please note that because this is a vanity number it won't be available right away. This number will be listed on your account after you buy it however it will not be available for use until our upstream carrier fulfills the request")
      .ariaLabel('Agree')
      .targetEvent($event)
      .ok('Please Continue')
      .cancel('Exit');

    $mdDialog.show(confirm).then(function () {
      console.log("md dialog show result ", arguments);
      buyNumber($event, number);
    });
  }

  function completeBuy(number) {
    return $q(function(resolve, reject) {
      var params = {};
      params['api_number'] = number.api_number;
      params['number'] = number.number;
      params['region'] = number.region;
      params['monthly_cost'] = number.monthly_cost;
      params['setup_cost'] = number.setup_cost;
      params['provider'] = number.provider;
      params['country'] = number.country;
      params['features'] = number.features.join(",");
      params['type'] = number.type;
      $shared.isCreateLoading = true;
      Backend.post("/did/saveNumber", params).then(function (res) {
        if (!res.data.success) {
          $shared.showError("Purchase Error", res.data.message);
          return;
        }
        Backend.get("/did/numberData/" + res.headers("X-Number-ID")).then(function (res) {
          var number = res.data;
          $shared.endIsCreateLoading();
          resolve(number);
        });
      }, function (res) {
        console.log("res is: ", res);
        if (res.status === 400) {
          var data = res.data;
          $shared.showError("Error", data.message);
        }
      });
    });
  }

  function buyNumber($event, number) {
    console.log("dialog ", $scope.inDialog);
    if ($scope.inDialog) {
      var confirm = window.confirm("Are you sure ?");
      console.log("confirmed ", confirm);
      if (confirm) {
        completeBuy(number).then(function(didNumber) {
          $scope.$emit("Created", id)
        });
        return;
      }
      return;
    }
      $shared.scrollTop();
    var confirm = $mdDialog.confirm()
      .title('Are you sure you want to purchase number "' + number.number + '"?')
      .textContent('this number will cost you ' + number.setup_cost + ' to setup then it will cost you ' + number.monthly_cost + ' every month. ')
      .ariaLabel('Buy number')
      .targetEvent($event)
      .ok('Yes')
      .cancel('No');
    $mdDialog.show(confirm).then(function() {
      completeBuy(number).then(function(didNumber) {
          $shared.endIsCreateLoading();
          purchaseConfirm($event, didNumber);
      });
    });
  }
  $scope.buyNumber = function ($event, number) {
    $shared.scrollTop();
    // Appending dialog to document.body to cover sidenav in docs app
    if ($scope.settings.number_type === 'vanity') {
      buyVanityNumber($event, number);
      return;
    }
    buyNumber($event, number);
  }
  $scope.changeCountry = function (country) {
    console.log("changeCountry ", country);
    $scope.settings.country = country;
    $scope.regions = [];
    $scope.listRegions();
  }
  $scope.changeRegion = function (region) {
    console.log("changeRegion ", region);
    $scope.settings.region = region;
    $scope.listRateCenters();
  }
  $scope.changeRateCenter = function (rateCenter) {
    console.log("changeRateCenter ", rateCenter);
    $scope.settings.rate_center = rateCenter;
  }

  $scope.listCountries = function () {
    return $q(function (resolve, reject) {
      Backend.get("/getCountries").then(function (res) {
        console.log("got countries ", res.data);
        $scope.countries = res.data;
        resolve();
      });
    });

  }

  $scope.listRegions = function () {
    Backend.get("/getRegions?countryId=" + $scope.settings.country.id).then(function (res) {
      console.log("got regions ", res.data);
      $scope.regions = res.data;
    })

  }
  $scope.listRateCenters = function () {
    Backend.get("/getRateCenters?countryId=" + $scope.settings.country.id + "&regionId=" + $scope.settings.region.id).then(function (res) {
      console.log("got rate centers ", res.data);
      $scope.rateCenters = res.data;
    })

  }
  $scope.querySearch = function (query) {
    console.log("querySearch query is: " + query);
    var all = $scope.rateCenters;
    return $q(function (resolve, reject) {
      var regexp = new RegExp(".*" + query.toLowerCase() + ".*");
      var results = [];
      angular.forEach(all, function (item) {
        if (item.toLowerCase().match(query)) {
          results.push(item);
        }
      });
      return resolve(results);
    });
  }
  $scope.searchTextChange = function (text) {
    console.log("searchTextChange");
  }
  $scope.selectedItemChange = function (item) {
    console.log('rc Item changed to ' + JSON.stringify(item));
    $scope.settings['rate_center'] = item;
  }
  $scope.queryFaxSearch = function (query) {
    console.log("querySearch query is: " + query);
    var all = $scope.rateCenters;
    return $q(function (resolve, reject) {
      var regexp = new RegExp(".*" + query.toLowerCase() + ".*");
      var results = [];
      angular.forEach(all, function (item) {
        if (item.toLowerCase().match(query)) {
          results.push(item);
        }
      });
      return resolve(results);
    });
  }
  $scope.searchFaxTextChange = function (text) {
    console.log("searchTextChange");
  }
  $scope.selectedFaxItemChange = function (item) {
    console.log('rc Item changed to ' + JSON.stringify(item));
    $scope.settings['rate_center'] = item;
  }
  $scope.hideOptions = function () {
    $scope.settings.showMoreOptions = false;
  }
  $scope.showOptions = function () {
    $scope.settings.showMoreOptions = true;
  }
  $scope.buyVoiceNumbers = function () {
    //$scope.settings.number_for='voice';
    console.log("buy voice numbers");
    $state.go('buy-numbers-select', {
      type: "voice"
    });
  }
  $scope.buyFaxNumbers = function () {
    //$scope.settings.number_for='fax';
    $state.go('buy-numbers-select', {
      type: "fax"
    });
  }
  $scope.backToSearch = function () {
    $scope.state = "SEARCHING";
  }

  $scope.init = function (inDialog, type) {
    $scope.inDialog = inDialog;
    $scope.settings.number_for = type;
    console.log("init ", arguments);
  }

  $scope.load();
});
