'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CallsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, SharedPref) {
    SharedPref.updateTitle("Calls");
    $scope.pagination = pagination;
  $scope.settings = {
    page: 0
  };
  $scope.calls = [];
  $scope.load = function() {
    SharedPref.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/call/listCalls" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'calls' );
      pagination.loadData().then(function(res) {
      $scope.calls = res.data.data;
      SharedPref.endIsLoading();
    })
  }
  $scope.viewCall= function(call) {
    $state.go('call-view', {callId: call.id});
  }

  $scope.load();
});

