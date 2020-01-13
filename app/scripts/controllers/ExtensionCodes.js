'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionCodesCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, SharedPref, $q ) {
    SharedPref.updateTitle("Extension Codes");
  $scope.users = [];
  $scope.load = function() {
      SharedPref.isLoading = true;
      return $q(function(resolve, reject) {
        $q.all([
          Backend.get("/flow/listFlows"),
          Backend.get("/settings/extensionCodes")
        ]).then(function(res) {
        $scope.flows = res[0].data.data;
        var codes = res[1].data;
        angular.forEach(codes, function(code) {
            angular.forEach($scope.flows, function(flow) {
              if ( flow.id === code.flow_id ) {
                code.flow = flow;
              }
            });
         });
         $scope.codes = codes;

        SharedPref.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.saveCodes = function() {
    var codes = angular.copy($scope.codes).map(function(code) {
      delete code['flow'];
      return code;
    });
    var data = {"codes": codes};
    Backend.post("/settings/extensionCodes", data).then(function(res) {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Extension codes updated..')
            .position("top right")
            .hideDelay(3000)
        );
          });
    });
  }
 $scope.addCode = function() {
    var copy = {
      "name": "",
      "flow_id": null
    };
    $scope.codes.push(copy);
  }
  $scope.changeFlow = function($index, model) {
    console.log("changeFlow called ", arguments);
    $scope.codes[$index].flow_id = model.id;
  }
  
  $scope.removeCode = function($index, code) {
    $scope.codes.splice($index, 1);
  }

  $scope.load();
});

