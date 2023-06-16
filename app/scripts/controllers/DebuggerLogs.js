'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('DebuggerLogsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $shared, $q, $stateParams) {
    $shared.updateTitle("Debugger Logs");
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.$stateParams = $stateParams
  $scope.settings = {
    page: 0
  };
  $scope.logs = [];
  $scope.load = function() {
    $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/log/listLogs" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'logs' );
      $q.all([
      Backend.get("/flow/list?all=1"),
      pagination.loadData()
      ]).then(function(res) {
        $scope.flows = res[0].data.data;
        $scope.logs = res[1].data.data;
        console.log("logs are ", $scope.logs);
      $shared.endIsLoading();
    })
  }
  $scope.viewLog= function(log) {
    $state.go('debugger-log-view', {logId: log.api_id});
  }

  $scope.load();
});

