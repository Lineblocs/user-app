'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYOCarrierEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit Carrier");
  $scope.flows = [];
  $scope.carrier = null;
  $scope.submit = function(carrier) {
    var params = {};
    params['name'] = $scope.carrier.name;
    params['ip_address'] = $scope.carrier.ip_address;
    params['routes'] = $scope.carrier.routes;
    params['auths'] = $scope.carrier.auths;
    var toastPos = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    var toastPosStr = Object.keys(toastPos)
      .filter(function(pos) { return toastPos[pos]; })
      .join(' ');
    console.log("toastPosStr", toastPosStr);
      $shared.isCreateLoading = true;
    Backend.post("/byo/carrier/" + $stateParams['carrierId'], params).then(function() {
        console.log("updated carrier..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Carrier updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('byo-carriers', {});
      $shared.endIsCreateLoading();
    });
  }
   $scope.addRoute = function() {
    var copy = {
      "prefix": "",
      "prepend": "",
      "match": ""
    };
    $scope.carrier.routes.push(copy);
  }
   $scope.addAuth= function() {
     console.log("addAuth called..");
    var copy = {
      "ip": "",
      "range": "/32"
    };
    $scope.carrier.auths.push(copy);
  }
  $scope.removeAuth = function($index, auth) {
    $scope.carrier.auths.splice($index, 1);
  }
  $scope.removeRoute = function($index, route) {
    $scope.carrier.routes.splice($index, 1);
  }

  $shared.isLoading = true;
  Backend.get("/byo/carrier/" + $stateParams['carrierId']).then(function(res) {
    $scope.carrier = res.data;
    $shared.endIsLoading();
  });
});

