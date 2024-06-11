'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CallsCtrl', function ($scope, Backend, pagination, $location, $state, $stateParams, $mdDialog, $shared) {
    $shared.updateTitle("Calls");
    console.log("STATE PARAMS ", $stateParams);
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.$stateParams = $stateParams;
  $scope.settings = {
    page: 0
  };
  $scope.calls = [];
  $scope.$shared = $shared;
  $scope.load = function() {
      console.log('loading calls')
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/call/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'calls' );
      pagination.loadData().then(function(res) {
        console.log('call data ',res.data.data);
      $scope.calls = res.data.data;
      $shared.endIsLoading();
    })
  }
  $scope.viewCall= function(call) {
    $state.go('call-view', {callId: call.api_id});
  }

  $scope.load();
});

