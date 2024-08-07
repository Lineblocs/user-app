'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('MyNumbersEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit Number");
  $scope.flows = [];
  $scope.didActions = [
    {
      name: 'Accept Call',
      value: 'accept-call'
    },
    {
      name: 'None',
      value: 'none'
    },
    /*
    {
      name: 'Accept Fax',
      value: 'accept-fax'
    },
    */

  ]
  $scope.number = null;
  $scope.saveNumber = function(number) {
    var params = {};
    params['name'] = $scope.number.name;
    params['flow_id'] = $scope.number.flow_id;
    params['did_action'] = $scope.number.did_action;
    params['tags'] = $scope.number.tags;
    var toastPos = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    var toastPosStr = Object.keys(toastPos)
      .filter(function(pos) { return toastPos[pos]; })
      .join(' ');
    console.log("toastPosStr", toastPosStr);
      $shared.isCreateLoading = true;
    Backend.post("/did/" + $stateParams['numberId'], params).then(function() {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Number updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('my-numbers', {});
      $shared.endIsCreateLoading();
    });
  }
  $scope.changeFlow = function(flow) {
    $scope.number.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.changeDIDAction = function(action) {
    $scope.number.did_action = action;
    console.log("changeDIDAction", action);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }

  $scope.setupFlow = function($event, extension) {
    $mdDialog.show({
      controller: SetupDialogController,
      templateUrl: 'views/dialogs/setup-flow.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "title": "DID flow for " + $scope.number.number,
        "category": "did",
        "onSuccess": function(flowId) {

          Backend.get("/flow/list?all=1").then(function(res) {
            console.log("setting flow ", flowId);
            $scope.flows = res.data.data;
            angular.forEach($scope.flows, function(flow) {
              if ( flow.public_id === flowId) {
                  $scope.number['flow_id'] = flow.id;
              }
            });
            $shared.endIsLoading();
            $mdDialog.hide();
          } );
        },
        "onError": function(flowId) {
          console.error("error occured..");
        },

      }
    })
    .then(function() {
    }, function() {
    });
  }



  $shared.isLoading = true;
  $q.all([
    Backend.get("/flow/list?all=1"),
    Backend.get("/did/" + $stateParams['numberId'])
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $scope.number = res[1].data;
    $shared.endIsLoading();
  });
});

