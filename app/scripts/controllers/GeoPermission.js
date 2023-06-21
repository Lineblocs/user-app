'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('GeoPermissionCtrl', function ($scope, Backend, pagination, $location, $state, $stateParams, $mdDialog, $shared) {
    $shared.updateTitle("GeoPermission");
    console.log("STATE PARAMS ", $stateParams);
    $scope.geoCountries = [];
    $scope.load = function() {
      Backend.get("/workspaceRoutingACL/list").then((item) => {
        item.data.forEach((country) => {
          if (country.preset_acl_enabled && country.enabled === null) country.enabled = country.preset_acl_enabled;
        });
        return item;
      }).then(function(res) {
        $shared.isLoading = false;
        $scope.geoCountries = res.data;
      })
    }
    $scope.updateACLs = function() {
      const requestData = $scope.geoCountries.map((country) => {

        //0 - creating object
        const object = {
          routing_acl_id: country.routing_acl_id,
          enabled: country.enabled,
        };

        //1 - adding the workspace id if it exists if not then we are creating a new one
        if (country.workspace_acl_id) object.id = country.workspace_acl_id;
        return object;
      });

      Backend.post('/workspaceRoutingACL/saveACLs', requestData)
        .then(function(response) {
          console.log('Success:', response);
        }, function(error) {
          console.log('Error:', error);
        });
    };
    $scope.load();
});

