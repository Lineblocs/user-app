'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionCodesCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Extension Codes");
  $scope.users = [];

  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        $q.all([
          Backend.get("/flow/listFlows?all=1"),
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

        $shared.endIsLoading();
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
    $shared.isCreateLoading = true;
    Backend.post("/settings/extensionCodes", data).then(function(res) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Extension codes updated..')
            .position("top right")
            .hideDelay(3000)
        );
        $shared.endIsCreateLoading();
    });
  }
 $scope.addCode = function() {
    var copy = {
      "name": "",
      "flow_id": null
    };
    $scope.codes.push(copy);
  }
  $scope.changeFlow = function($index) {
    console.log("changeFlow called ", arguments);
    console.log("codes are ", $scope.codes);
    $scope.codes[$index].flow_id = $scope.codes[$index].flow.id;
  }
  
  $scope.removeCode = function($index, code) {
    $scope.codes.splice($index, 1);
  }

  $scope.load();
});

