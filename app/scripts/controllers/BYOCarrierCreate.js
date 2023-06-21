'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYOCarrierCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared ) {
	  $shared.updateTitle("Create Carrier");
  $scope.values = {
    name: "",
    ip_address: "",
    routes: [],
    auths: [],
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting carrier form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['name'] = $scope.values.name;
      values['ip_address'] = $scope.values.ip_address;
      values['routes'] = $scope.values.routes;
      values['auths'] = $scope.values.auths;
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
      Backend.post("/byo/carrier", values).then(function() {
       console.log("updated carrier..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created carrier')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('byo-carriers', {});
        $shared.endIsCreateLoading();
      });
    }
  }
   $scope.addRoute = function() {
     console.log("addRoute called..");
    var copy = {
      "prefix": "",
      "prepend": "",
      "match": ""
    };
    $scope.values.routes.push(copy);
  }
   $scope.addAuth= function() {
     console.log("addAuth called..");
    var copy = {
      "ip": "",
      "range": "/32"
    };
    $scope.values.auths.push(copy);
  }
  $scope.removeRoute = function($index, route) {
    $scope.values.routes.splice($index, 1);
  }
  $scope.removeAuth = function($index, auth) {
    $scope.values.auths.splice($index, 1);
  }

  $shared.endIsLoading();
});

