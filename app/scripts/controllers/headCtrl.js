'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('HeadCtrl', function ($scope, SharedPref) {
  $scope.SharedPref = SharedPref;
});