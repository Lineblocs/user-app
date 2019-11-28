'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('VerifiedCallerIdsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, SharedPref, $q ) {
    SharedPref.updateTitle("Verified Caller IDs");
    function DialogController($scope, $mdDialog, Backend, SharedPref, onCreated) {
      $scope.SharedPref = SharedPref;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        step1: {
          number: ""
        }, 
        step2:{
          code: ""
        }

      };
      $scope.step = 1;
      $scope.postStep1 = function() {
        var data = angular.copy($scope.data.step1);
        Backend.post("/settings/verifiedCallerids", data).then(function(res) {
          $scope.step = 2;           
        });
      }
      $scope.postStep2 = function() {
        var data = {
         'code': $scope.data.step2['code'],
         'number': $scope.data.step1['number']
        };
        Backend.post("/settings/verifiedCallerids/confirm", data).then(function(res) {
          var data = res.data;
          if (data.success) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Number verified')
            .position("top right")
            .hideDelay(3000)
        );
            $scope.close();
            onCreated();
          } else {
            $scope.error = true;
            $scope.errorText = "The code was invalid please try again.";
          }
        });

      }

      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.numbers = [];
  $scope.load = function() {
      SharedPref.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/settings/verifiedCallerids").then(function(res) {
          $scope.numbers = res.data;
          SharedPref.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.createNumber = function($event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/add-callerid.html',
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
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('This will permantely remove the caller ID')
          .ariaLabel('Delete extension')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        SharedPref.isLoading = true;
      Backend.delete("/settings/verifiedCallerids/" + number.public_id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Number deleted..')
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

