'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('VerifiedCallerIdsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
  $shared.updateTitle("Verified Caller IDs");
  $scope.Backend = Backend;
    function DialogController($scope, $mdDialog, Backend, $shared, onCreated) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.$mdDialog = $mdDialog;
      $scope.countryCode = '';
      $scope.data = {
        step1: {
          number: "",
          notes: ""
        },
        step2:{
          code: ""
        }

      };
      $scope.step = 1;
      $scope.countries = [];
      Backend.get('/getCountryList').then(function(countries) {
        $scope.countries = countries.data.data;
      });
      $scope.postStep1 = function() {
        const data = angular.copy($scope.data.step1);
        data.number = $scope.countryCode + data.number;
        Backend.post("/settings/verifiedCallerids", data).then(function(res) {
          $scope.step = 2;
        });
      }

      $scope.onNumberChange = function() {
        $scope.data.step1.number = Number($scope.data.step1.number.replace(/[^0-9]/g, '').slice(0, 10));
        if (!$scope.data.step1.number) $scope.data.step1.number = '';
      }

      $scope.getMatchedCountry = function(text) {
        console.log('text', text);
        if (!text) return;
        const matchedCountry = $scope.countries.filter(country => country.name.toLowerCase().includes(text.toLowerCase()));
        console.log('matchedCountry', matchedCountry);
        return matchedCountry;
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
        console.log("closing dialog..");
        $mdDialog.hide();
      }
    }

  $scope.numbers = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/settings/verifiedCallerids").then(function(res) {
          $scope.numbers = res.data;
          $shared.endIsLoading();
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
        $shared.isLoading = true;
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

