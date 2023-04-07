'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HistoryCtrl', function ($scope, Backend, pagination, $location, $state, $shared, $q, $stateParams) {
    $shared.updateTitle("History");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
    $shared.isLoading = false;
    $scope.history = [
      {
        "from": "123-202-3030",
        "to": "123-222-3030",
        "call_duration": 36,
        "direction": "incoming",
        "status": "answered"
      },
      {
        "from": "122-202-3030",
        "to": "123-202-3030",
        "call_duration": 1806,
        "direction": "outgoing",
        "status": "rejected"
      },
      {
        "from": "121-202-3030",
        "to": "123-102-3030",
        "call_duration": 1254,
        "direction": "incoming",
        "status": "busy"
      }
    ];
    $scope.displayTime = function(durationInSeconds) {
      var minutes = Math.floor(durationInSeconds / 60);
      var seconds = durationInSeconds % 60;
      if (minutes === 0) {
        return seconds + " seconds";
      } else if (seconds === 0) {
        return minutes + " minute";
      } else {
        return minutes + " minute " + seconds + " seconds";
      }
    };
    $scope.sortColumn = function(column) {
      if ($scope.activeColumn === column) {
        $scope.sortReverse = !$scope.sortReverse;
      } else {
        $scope.activeColumn = column;
        $scope.sortReverse = false;
      }

      $scope.history.sort(function(a, b) {
        if (a[column] < b[column]) {
          return $scope.sortReverse ? 1 : -1;
        } else if (a[column] > b[column]) {
          return $scope.sortReverse ? -1 : 1;
        } else {
          return 0;
        }
      });
    };
    $scope.toggleSortOrder = function(column, currentSortOrder) {
      if ($scope.activeColumn === column) {
        $scope.sortReverse = !currentSortOrder;
      } else {
        $scope.activeColumn = column;
        $scope.sortReverse = false;
      }
    }
});
