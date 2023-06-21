// This wrapper is to prevent global variable assignments. It's not to
// prevent naming conflicts ("674497323404793172" already does), but to
// work better with minification tools.
(function() {
    // `{}` is to guarantee that any subsequent `mod.result` assignment will make
    // the variable different from the initial value.
    var initialModResult_674497323404793172 = {};

    var mods_674497323404793172 = [
    {fun: function(exports, module, require) {


// *****
// ***** file-674497323404793172
// ***** (((

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared) {
	  $shared.updateTitle("Buy Numbers");
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
    $shared.endIsLoading();
  }
  $scope.fetch =  function(event, didForm) {
		$scope.triedSubmit = true;
		if (!didForm.$valid) {
        return;
    }
    var data = {};
    //data['region'] = $scope.settings['region'];
    data['region'] = $scope.settings['region'];
    data['rate_center'] = $scope.settings['rate_center'];
    //data['prefix'] = $scope.settings['pattern'];
    data['prefix'] = "";
    data['country_iso'] = $scope.settings['country']['iso'];
    $shared.isCreateLoading = true;
    Backend.get("/did/availableNumbers", { "params": data }).then(function(res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
      $shared.endIsCreateLoading();
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
        params['api_number'] = number.api_number;
        params['number'] = number.number;
        params['region'] = number.region;
        params['monthly_cost'] = number.monthly_cost;
        params['provider'] = number.provider;
        params['country'] = number.country;
        Backend.post("/did/", params).then(function(res) {
          Backend.get("/did/" + res.headers("X-Number-ID")).then(function(res) {
              var number = res.data;
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
  }

    $scope.load();
});


// ***** ))) file end


}, nameIndexes: {}, result: initialModResult_674497323404793172}
    ];

    // This wrapper is to prevent naming conflicts.
    (function() {
        var initialModResult = initialModResult_674497323404793172;
        var mods = mods_674497323404793172;
        var run = function(index) {
            var mod = mods[index];
            var theExports = {};
            var theModule = {exports: theExports};
            var theRequire = function(name) {

                // half-way result, for caching & preventing infinite loops
                mod.result = theModule.exports;

                var newIndex = mod.nameIndexes[name];
                if (newIndex === undefined) {
                    throw new Error("Cannot find module " + JSON.stringify(name) + ".");
                }
                if (mods[newIndex].result === initialModResult) {
                    run(newIndex);
                }
                return mods[newIndex].result;
            };
            mod.fun.apply(theExports, [theExports, theModule, theRequire]);
            mod.result = theModule.exports; // for caching
        };
        run(0);
    })();
})();
