'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('EditPortCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
  $shared.updateTitle("Edit Port Number");
  $scope.flows = [];
  $scope.number = null;
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
      return false;
    }
    return true;
  }
  $scope.saveNumber = function (form) {
    console.log("saveNumber");
    $scope.triedSubmit = true;

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
    if (checkFile("#loa", "noLOA")) {
      params.append("loa", angular.element("#loa").prop("files")[0]);
    }
    if (checkFile("#csr", "noCSR")) {
      params.append("csr", angular.element("#csr").prop("files")[0]);
      return;
    }
    if (checkFile("#invoice", "noInvoice")) {
      params.append("invoice", angular.element("#invoice").prop("files")[0]);
      return;
    }
    $shared.isLoading = true;
    var errorMsg = "One of the documents could not be uploaded please be sure to upload a file size less than 10MB and use one of the following file formats: pdf,doc,doc";
    Backend.postFiles("/port/" + $stateParams['numberId'], params, true).then(function () {
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
  }
  $scope.documentURL = function (type) {
    var url;
    angular.forEach($scope.number.documents, function (document) {
      if (document.type === type) {
        url = document.url;
      }
    });
    return url;
  }
  $shared.isLoading = true;
  Backend.get("/port/" + $stateParams['numberId']).then(function (res) {
    $scope.number = res.data;
    angular.forEach($shared.billingCountries, function (country) {
      if (country.iso === $scope.number.country) {
        $scope.number.country = country;
      }
    });
    $scope.loa =
      $shared.endIsLoading();
  });
});
