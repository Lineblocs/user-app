'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("Flows");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.settings = {
    page: 0
  };
  $scope.flows = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading =true;
        pagination.resetSearch();
        pagination.changeUrl( "/flow/listFlows" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'flows' );
        pagination.loadData().then(function(res) {
        $scope.flows = res.data.data;
        $shared.endIsLoading();
        resolve();
      }, reject);
    });
  }
  $scope.editFlow = function(flow) {
    $shared.changeRoute('flow-editor', {flowId: flow.public_id});
  }
  $scope.createFlow = function() {
    $shared.changeRoute('flow-editor', {flowId: "new"}); 
  }
  $scope.deleteFlow = function($event, flow) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this flow?')
          .textContent('This will permantely remove the flow and also unset the flow on numbers that have this flow attached to it')
          .ariaLabel('Delete flow')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/flow/deleteFlow/" + flow.id).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Flow deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Flow deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }

  $scope.load();
});

