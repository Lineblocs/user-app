'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HostedTrunksEditCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Trunks");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
  $scope.values = {};
  $scope.load = function() {
      var url ='/trunk/' + $stateParams['trunkId'];

      $q.all([
        Backend.get("/did/listNumbers?all=1").then((res) =>  {
        Backend.get(url)
        ]).then(function(res) {
        console.log("trunk data ", res);
        var numbers = res[0].data.data;
        var data = res[1].data;
        $scope.values = angular.copy( data );

        $scope.values['recovery_sip_uri'] = data['orig_settings']['recovery_sip_uri'];
        $scope.values['sip_uri'] = data['orig_endpoints'][0].sip_uri;
        $scope.values['termination_sip_uri'] = data['term_settings']['sip_addr'];

 
        $shared.endIsLoading();
    });
  }
  $scope.editTrunk = function(trunk) {
    console.log('save trunk called...');
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

   console.log('saveTrunk params are ', params);
    Backend.post("/trunk/" + $stateParams['trunkId'], params).then(function() {
        console.log("updated trunk..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('updated trunk')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('hosted-trunks', {});
      $shared.endIsCreateLoading();
    });
  }

  $scope.load();
});

