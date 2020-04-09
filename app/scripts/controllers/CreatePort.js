'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CreatePortCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
  $shared.updateTitle("Create Number");
  $scope.flows = [];
  $scope.number = {
    "first_name": "",
    "last_name": "",

    "city": "",
    "state": "",
    "zip": "",
    "country": "",
    "provider": "",
    "number": "",
    "address_line_1": "",
    "address_line_2": "",
  }
  $scope.files = {
    "noLOA": false,
    "noCSR": false,
    "noInvoice": false
  };

  function checkFile(id, key) {
    if (angular.element(id).prop("files").length === 0) {
      $scope.files[key] = true;
      return false;
    }
    $scope.files[key] = false;
    return true;
  }
  $scope.saveNumber = function (form) {
    console.log("saveNumber");
    $scope.triedSubmit = true;
    if (!checkFile("#loa", "noLOA")) {
      return;
    }
    if (!checkFile("#csr", "noCSR")) {
      return;
    }
    if (!checkFile("#invoice", "noInvoice")) {
      return;
    }

    if (!form.$valid) {
      return;
    }
    var params = new FormData();
    params.append("first_name", $scope.number['first_name']);
    params.append("last_name", $scope.number['last_name']);

    params.append("city", $scope.number['city']);
    params.append("state", $scope.number['state']);
    params.append("zip", $scope.number['zip']);
    params.append("country", $scope.number['country']['iso']);
    params.append("provider", $scope.number['provider']);
    params.append("number", $scope.number['number']);
    params.append("address_line_1", $scope.number['address_line_1']);
    params.append("address_line_2", $scope.number['address_line_2']);
    params.append("loa", angular.element("#loa").prop("files")[0]);
    params.append("csr", angular.element("#csr").prop("files")[0]);
    params.append("invoice", angular.element("#invoice").prop("files")[0]);
    $shared.isLoading = true;
    var errorMsg = "One of the documents could not be uploaded please be sure to upload a file size less than 10MB and use one of the following file formats: pdf,doc,doc";
    Backend.postFiles("/port/saveNumber", params, true).then(function () {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
          .textContent('Number port created..')
          .position("top right")
          .hideDelay(3000)
        );
        $state.go('ports', {});
      }, function() {
        $shared.endIsLoading();
      });
  }
  $scope.changeCountry = function (country) {
    console.log("changeCountry ", country);
    $scope.number.country = country;
    $scope.number.address_line_1 = '';
    $scope.number.address_line_2 = '';
    $scope.number.city = '';
    $scope.number.state = '';
    $scope.number.zip = '';
  }

  $shared.endIsLoading();
});
