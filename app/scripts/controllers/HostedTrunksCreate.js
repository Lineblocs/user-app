'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HostedTrunksCreateCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Trunks");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.numbers = [];
    $scope.Backend = Backend;
    $scope.triedSubmit = false;
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
  $scope.values = {};
  $scope.load = function() {
    Backend.get("/did/list?all=1").then((res) =>  {
      numbers = res.data.data;
      $shared.endIsLoading();
    });
  }
  $scope.checkTrunkFields = function() {
    if ($scope.values.recovery_sip_uri && $scope.values.sip_uri && $scope.values.termination_sip_uri && $scope.values.name) {
      $scope.errorMessage = null;
    } 
  };
  $scope.saveTrunk = function(trunk) {
    console.log('save trunk called...');
    $scope.triedSubmit = true;
    var params = angular.copy( $scope.values );
    params['record'] = params.record||false;
    params['orig_settings'] = {
      recovery_sip_uri: params.recovery_sip_uri
    };
   params['orig_endpoints'] = [{
      sip_uri: params.sip_uri
   }];
   //todo need to integrate with frontend
   params['term_acls'] = [];
   params['term_creds'] = [];
   params['term_settings'] = {
      sip_addr: params.termination_sip_uri
   };
   if(!params.recovery_sip_uri || !params.sip_uri || !params.termination_sip_uri || !params.name){
      $scope.errorMessage = 'Please fill in all fields before submitting';
      return;
   }
   params['did_numbers'] =$scope.numbers.filter( function( number ) {
    return number.checked;
   });
   console.log('saveTrunk params are ', params);
    Backend.post("/trunk", params, true, true).then(function() {
        console.log("created trunk..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('created trunk')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('hosted-trunks', {});
      $shared.endIsCreateLoading();
    });
  }

  $scope.load();
});

