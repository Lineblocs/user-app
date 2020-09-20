'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
 angular.module('Lineblocs').controller('DashboardRedirectCtrl', ['$scope', '$timeout', 'Backend', '$shared', '$q', '$state', function ($scope, $timeout, Backend, $shared, $q, $state) {
	  $shared.updateTitle("Dashboard");
		  var urlObj = URI(document.location.href.split("#")[1]);
          var query = urlObj.query(true);


          var token = query.auth;
		  var workspaceId = query.workspaceId;
		  console.log("in dashboard redirect");
		  Backend.post("/internalAppRedirect", {
			token: token,
			workspaceId: workspaceId

		  }).then(function(res) {
			  console.log("received reply ", res);
			var token =res.data;
			var workspace =res.data.workspace;
			$shared.setAuthToken(token);
			$shared.setWorkspace(workspace);
			$state.go('dashboard-user-welcome', {});
		  });
}]);