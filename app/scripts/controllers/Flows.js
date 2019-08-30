'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, SharedPref) {
	  SharedPref.updateTitle("Flows");
  $scope.settings = {
    page: 0
  };
  $scope.flows = [];
  $scope.load = function() {
    SharedPref.isLoading =true;
    Backend.get("/flow/listFlows", $scope.settings).then(function(res) {
      $scope.flows = res.data.data;
      SharedPref.isLoading =false;
    })
  }
  $scope.editFlow = function(flow) {
    $state.go('flow-editor', {flowId: flow.id});
  }
  $scope.createFlow = function() {
    $state.go('flow-editor', {flowId: "new"}); 
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
      Backend.delete("/flow/deleteFlow/" + flow.id).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Flow deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          $scope.load();

      })
    }, function() {
    });
  }

  $scope.load();
});

