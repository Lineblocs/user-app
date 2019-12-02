'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('IpWhitelistCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, SharedPref, $q ) {
    SharedPref.updateTitle("IP Whitelist");
      $scope.settings = {
        disabled: false
      }
    function DialogController($scope, $mdDialog, Backend, SharedPref, onCreated) {
      $scope.SharedPref = SharedPref;
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
      SharedPref.isLoading = true;
      return $q(function(resolve, reject) {
        $q.all([
          Backend.get("/self"),
          Backend.get("/settings/ipWhitelist")
         ]).then(function(res) {
          $scope.disabled = res[0].data.ip_whitelist_disabled;
          $scope.settings.disabled = $scope.disabled;
          $scope.ips = res[1].data;
          SharedPref.endIsLoading();
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
        SharedPref.isLoading = true;
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
      SharedPref.isLoading = true;
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

