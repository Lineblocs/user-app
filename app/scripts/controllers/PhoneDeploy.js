'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PhoneDeployCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $mdToast) {
    $shared.updateTitle("Phone Deploy");
    $scope.pagination = pagination;
    $scope.phones = [];
    $scope.step = 1;

    $scope.start = function() {
      $shared.isLoading = true;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Started deployment..')
                .position("top right")
                .hideDelay(3000)
            );
      Backend.post("/startDeploy").then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Deployment completed..')
                .position("top right")
                .hideDelay(3000)
            );
            $scope.step = 2;
            $shared.endIsLoading();
      });
    }
    $shared.isLoading = true;

  Backend.get("/getDeployInfo").then(function(res) {
    $scope.info = res.data;
    console.log("got deploy info step is: " + $scope.step);
    $shared.endIsLoading();
  });
});

