'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('WorkspaceParamCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Workspace Params");
  $scope.params = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/workspaceParam/listParams").then(function(res) {
          $scope.params = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.saveParams = function() {
      var data = angular.copy($scope.params);
      Backend.post("/workspaceParam/saveParams", data).then(function() {
          $mdToast.show(
          $mdToast.simple()
            .textContent('Workspace params saved successfully..')
            .position("top right")
            .hideDelay(3000)
        );
          });
  }
  $scope.addParam = function() {
    $scope.params.push({
      "key": "",
      "value": ""
    });
  }
  $scope.deleteParam = function(index, param) {
    $scope.params.splice(index, 1);
  }


  $scope.load();
});

