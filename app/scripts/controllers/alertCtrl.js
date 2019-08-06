'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('AlertDemoCtrl', function ($scope) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'info', msg: 'Ok! Not bad, but you can do better.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];
  // $scope.types = [
  //   { name:'info'},
  //   { name:'danger'},
  //   { name:'success'},
  //   { name:'warning'}
  // ];

  $scope.addAlert = function() {
    $scope.alerts.push({ msg: $scope.message});
    $scope.message = '';
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  $scope.addSpecialWarnMessage = function() {
        growl.addWarnMessage("This adds a warn message");
        growl.addInfoMessage("This adds a info message");
        growl.addSuccessMessage("This adds a success message");
        growl.addErrorMessage("This adds a error message");
    }
});