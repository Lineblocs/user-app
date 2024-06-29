'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BlockedNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $http ) {
    $shared.updateTitle("Blocked Numbers");
    $scope.Backend = Backend;
    function DialogController($scope, $mdDialog, Backend, $shared, onCreated) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.countryCode = '';
      $scope.data = {
        number: "",
        notes: ""
      };
      $scope.searchCountry = '';
      $http.get('../../scripts/constants/country-list.json').then(function(countries) {
        $scope.countries = countries.data;
      });

      $scope.onNumberChange = function() {
        $scope.data.number = Number($scope.data.number.replace(/[^0-9]/g, '').slice(0, 10));
        if (!$scope.data.number) $scope.data.number = '';
      }

      $scope.getMatchedCountry = function(text) {
        console.log('text', text);
        if (!text) return;
        const matchedCountry = $scope.countries.filter(country => country.name.toLowerCase().includes(text.toLowerCase()));
        console.log('matchedCountry', matchedCountry);
        return matchedCountry;
      }
      $scope.submit= function() {
        const data = angular.copy($scope.data);
        data.number = $scope.countryCode + data.number;
        Backend.post("/settings/blockedNumbers", data).then(function(res) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Number added to blocked callers list successfully.')
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


    function ImportDialogController($scope, $mdDialog, Backend, $shared, onCreated, onFinished) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        file: null
      };
      $scope.submit = function($event) {
        var files = angular.element("#uploadFile").prop("files");
        if ( files.length === 0 ) {
          $scope.errorText="Please select atleast 1 file..";
          return;
        }
        var params = new FormData();
        angular.forEach(files, function(file) {
          params.append("file[]", file);
        });
        $shared.isCreateLoading = true;
        Backend.postFiles("/settings/blockedNumbers/uploadList", params, true).then(function(res) {
          var data = res.data;
          $shared.endIsCreateLoading();
          if (data.amountFailed > 0) {
              angular.forEach(data.results, function(result) {
                if ( !result.success ) {
                  var msg = result.name + " failed to upload please check the file type and size";
                  $shared.showToast( msg );
                }
              });
            }
            $mdDialog.hide();
            onFinished();
        });
      }
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.numbers = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/settings/blockedNumbers/list").then(function(res) {
          $scope.numbers = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.createNumber = function($event) {
    console.log('createNumber',  $scope.countries);
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/add-blocked-number.html',
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
          .textContent('This will permantely remove the number from your blocked list')
          .ariaLabel('Delete extension')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/settings/blockedNumbers/" + number.public_id).then(function() {
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

  $scope.import= function($event) {
    const data = angular.copy($scope.data);
    console.log('import',  $scope.countries);
    $mdDialog.show({
      controller: ImportDialogController,
      templateUrl: 'views/dialogs/blocked-numbers-import.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onCreated: function() {
          $scope.load();
        },
        onFinished: function() {
          $scope.load();
        },


      }
    })
    .then(function() {
    }, function() {
    });
  }

  $scope.load();
});

