'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('DashboardWelcomeCtrl', function ($scope, Backend, SharedPref, $q) {
      SharedPref.updateTitle("Dashboard");
	    $q.all([
            Backend.get("/self"),
            Backend.get("/getBillingInfo")
        ]).then(function(res) {
            SharedPref.isLoading = false;
            SharedPref.userInfo = res[0].data;
            SharedPref.billInfo = res[1].data; 
                });
});