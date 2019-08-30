'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('DashboardWelcomeCtrl', function ($scope, Backend, SharedPref) {
	  SharedPref.updateTitle("Dashboard");
			Backend.get("/getBillingInfo").then(function(re) {
                SharedPref.billInfo = res.data; 
            });
});