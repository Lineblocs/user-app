'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CreatePortCtrl', function ($scope, $timeout, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
  $shared.updateTitle("Create Number");
  $scope.continue = false;
  $scope.flows = [];
  $scope.step = 1;
  $scope.fileName = "";
  $scope.selectedPortType = "Port single number";
  $scope.tab1FormFilled = false;
  $scope.number = {
    "first_name": "",
    "last_name": "",

    "city": "",
    "state": "",
    "zip": "",
    "country": "",
    "provider": "",
    "number": "",
    "type_of_port": "Port single number",
    "address_line_1": "",
    "address_line_2": "",
  }
  $scope.files = {
    "noLOA": false,
    "noCSR": false,
    "noInvoice": false
  };

  $scope.tabChanged = function (tab) {
    $scope.selectedPortType = tab;
    console.log("tabChanged ", $scope.selectedPortType);
    // $scope.currentTab = tab;
  }

  $scope.uploadedFiles = {
    loa: null,
    csr: null,
    invoice: null
  }

  $scope.openFileInput = function (id) {
    $timeout(function () {
      const fileInput = document.getElementById(id);
      fileInput.click();
      fileInput.addEventListener('change', function (event) {
        console.log('Selected file:', event);
        if (event.target.files.length > 0) {
          $scope.uploadedFiles[id] = event.target.files[0];
          $scope.$apply();
        }
      });
    });
  };

  $scope.clearFileInput = function (id) {
    $scope.uploadedFiles[id] = null;
  }

  $scope.continueToProcess = function () {
    $scope.continue = true;
  }

  function checkFile(id, key) {
    if (angular.element(id) && angular.element(id).prop("files").length === 0) {
      $scope.files[key] = true;
      return false;
    }
    $scope.files[key] = false;
    return true;
  }
  $scope.saveNumber = function (form) {
    console.log("Port single number ===>", $scope.selectedPortType)
    $scope.triedSubmit = true;
    $scope.tab1FormFilled = true;
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
    params.append("address_line_1", $scope.number['address_line_1']);
    params.append("address_line_2", $scope.number['address_line_2']);
    params.append("loa", $scope.uploadedFiles['loa']);
    params.append("csr", $scope.uploadedFiles['csr']);
    params.append("invoice", $scope.uploadedFiles['invoice']);

    params.append("type_of_port", $scope.selectedPortType);

    if ($scope.selectedPortType === 'Port single number') {
      params.append("provider", $scope.number['provider']);
      params.append("number", $scope.number['number']);
    } else {
      const numbers = $scope.number['number'].split('\n').filter(item => item);
      params.append("provider", $scope.number['provider']);
      params.append("numbers", JSON.stringify(numbers));
    }




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
