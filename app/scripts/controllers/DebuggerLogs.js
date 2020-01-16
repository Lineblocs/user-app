'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('DebuggerLogsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, SharedPref, $q) {
    SharedPref.updateTitle("Debugger Logs");
    $scope.pagination = pagination;
  $scope.settings = {
    page: 0
  };
  $scope.logs = [];
  $scope.load = function() {
    SharedPref.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/log/listLogs" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'logs' );
      $q.all([
      Backend.get("/flow/listFlows?all=1"),
      pagination.loadData()
      ]).then(function(res) {
        $scope.flows = res[0].data.data;
        $scope.logs = res[1].data.data;
        console.log("logs are ", $scope.logs);
      SharedPref.endIsLoading();
    })
  }
  $scope.viewLog= function(log) {
    $state.go('debugger-log-view', {logId: log.api_id});
  }

  $scope.load();
});

