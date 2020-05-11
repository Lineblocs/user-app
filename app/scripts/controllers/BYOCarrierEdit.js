'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BYOCarrierEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit Carrier");
  $scope.flows = [];
  $scope.carrier = null;
  $scope.submit = function(carrier) {
    var params = {};
    params['name'] = $scope.carrier.name;
    params['ip_address'] = $scope.carrier.ip_address;
    params['routes'] = $scope.carrier.routes;
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
    Backend.post("/byo/carrier/updateCarrier/" + $stateParams['carrierId'], params).then(function() {
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
  $scope.removeRoute = function($index, route) {
    $scope.carrier.routes.splice($index, 1);
  }
  $shared.isLoading = true;
  Backend.get("/byo/carrier/carrierData/" + $stateParams['carrierId']).then(function(res) {
    $scope.carrier = res.data;
    $shared.endIsLoading();
  });
});

