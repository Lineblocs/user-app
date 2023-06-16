'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('IpWhitelistCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("IP Whitelist");
      $scope.settings = {
        disabled: false
      }
      $scope.Backend = Backend;
    function DialogController($scope, $mdDialog, Backend, $shared, onCreated) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.ranges = [
        "/8",
        "/16",
        "/24",
        "/32"
      ];
      $scope.data = {
        ip: "",
        range: "/32",
      };
      $scope.submit= function() {
        var data = angular.copy($scope.data);
        Backend.post("/settings/ipWhitelist", data).then(function(res) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('IP added')
            .position("top right")
            .hideDelay(3000)
        );
            $scope.close();
            onCreated();
        });
      }

      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.ips = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        $q.all([
          Backend.get("/self"),
          Backend.get("/settings/ipWhitelist/list")
         ]).then(function(res) {
          $scope.disabled = res[0].data.ip_whitelist_disabled;
          $scope.settings.disabled = $scope.disabled;
          $scope.ips = res[1].data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.createIp = function($event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/add-ip-whitelist.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onCreated: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.deleteIp = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this IP address?')
          .textContent('This will permantely remove the IP from your whitelist')
          .ariaLabel('Delete IP')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/settings/ipWhitelist/" + number.public_id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('IP deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }
  $scope.enableWhitelist = function($event, value) {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        var data = {"ip_whitelist_disabled": value};
        Backend.post("/updateSelf", data).then(function(res) {
          $scope.load();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.changeDisableState = function($event, value) {
    console.log("changeDisableState ", value);
    $scope.enableWhitelist($event, true);
  }
  $scope.load();
});

