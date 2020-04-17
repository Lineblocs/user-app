'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('RegisterCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle, $stateParams) {
	  $shared.updateTitle("Register");

	  var countryToCode = {
		  US: "+1",
		  CA: "+1",
	  };
	  $scope.acceptTerms = false;
	  $scope.triedSubmit = false;
	  $scope.passwordsDontMatch = false;
	  $scope.shouldSplash = false;
	  $scope.didVerifyCall = false;
	  $scope.step = 1;
	  $scope.userId = null;
	  $scope.token = null;
	  $scope.invalidCode =false; 
	  $scope.invalidNumber =false; 
	$scope.hasWorkspaceNameErr = false;
	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: ""
	};
	$scope.verify1 = {
		country: "US",
		mobile_number: ""
	};
	$scope.verify2 = {
		confirmation_code: ""
	};
  $scope.workspace = "";
  $scope.selectedTemplate = null;

  function doSpinup() {
	$scope.shouldSplash = true;
	$shared.setAuthToken( $scope.token );
	var data = { "userId": $scope.userId };
	$scope.invalidCode = false;
	$shared.changingPage = true;
	Backend.post("/userSpinup", data).then(function( res ) {
		var data = res.data;
		if ( data.success ) {

			Idle.watch();
			$shared.setAuthToken($scope.token);
			$shared.setWorkspace(res.data.workspace);
			$shared.changingPage = false;
			$state.go('dashboard-user-welcome', {});

			return;
		}
		$mdToast.show(
		$mdToast.simple()
			.textContent('Error occured while creating your account. please account support')
			.position("top right")
			.hideDelay(1000*10)
		);
	});

  }
    $scope.submit = function($event, registerForm) {
		console.log("called submit");
		$scope.triedSubmit = true;
		console.log("data is ", $scope.user);
		console.log("form ", registerForm);
		if (!$scope.acceptTerms) {
			$scope.triedSubmit = true;
			$scope.didNotAcceptTerms = true;
			return;
		}
		if ($scope.user.password !== $scope.user.password2) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (registerForm.$valid) {
			var data = angular.copy( $scope.user );
				$shared.changingPage = true;
			Backend.post("/register", data).then(function( res ) {
				var data = res.data;
				if ( !data.success ) {
					$shared.showError("Error", data.message);
					return;
				}
				$scope.token = data; 
				$scope.userId = data.userId;
				$shared.changingPage = false;
				$scope.step = 2;
			});
			return;
		}
      	return false;

	}

	$scope.submitVerify1Form = function($event, verify1Form) {
		console.log("called submitVerify1Form");
		$scope.triedSubmit = true;
		if (verify1Form.$valid) {
			var data = {};
			data.mobile_number = countryToCode[$scope.verify1.country] + $scope.verify1.mobile_number;
			data.userId = $scope.userId;
				$shared.changingPage = true;
			Backend.post("/registerSendVerify", data).then(function( res ) {
				var data = res.data;
					$shared.changingPage = false;
				if (res.data.valid) {
					$scope.didVerifyCall = true;
					$scope.invalidNumber = false;
					return;
				}
				$scope.invalidNumber = true;
				//$scope.showNumberInvalid = true;
			});
			return;
		}
		return false;
	}

	$scope.submitVerify2Form = function($event, verify2Form) {
		console.log("called submitVerify2Form");
		$scope.triedSubmit = true;
		if (verify2Form.$valid) {
			var data = angular.copy( $scope.verify2 );
			data.userId = $scope.userId;
				$shared.changingPage = true;
			Backend.post("/registerVerify", data).then(function( res ) {
				var isValid = res.data.isValid;
				$shared.changingPage = false;
				if (isValid) {
					var email = $scope.user.email;
					var splitted = email.split("@");
					$scope.workspace = $shared.cleanWorkspaceName(splitted[0]);
					$scope.step = 3;
				} else {
					$scope.invalidCode = true;
				}
			});
			return;
		}
		return false;
	}

	function checkWorkspaceName(name) {
		if (name !== name.toLowerCase()) {
			return false;
		}
		if (!name.match(/^[a-z0-9\-]+$/)) {
			return false;
		}
		return true;
	}
	$scope.submitWorkspaceForm = function($event, workspaceForm) {
		console.log("called submitWorkspaceForm");
		$scope.triedSubmit = true;
		if (!checkWorkspaceName($scope.workspace)) {
			$scope.hasWorkspaceNameErr = true;
			return;
		}
		if (workspaceForm.$valid) {
			var data = {};
			data["userId"] = $scope.userId;
			data.workspace = $scope.workspace;
				$shared.changingPage = true;
			Backend.post("/updateWorkspace", data).then(function( res ) {
				$shared.changingPage = false;
				if (res.data.success) {
					$scope.invalidWorkspaceTaken = false;
					//doSpinup();
					$scope.step = 4;
					return;
				}
				$scope.invalidWorkspaceTaken = true;
			});
		}
		return false;
	}

	$scope.finishSignup = function() {
		$scope.triedSubmit = true;
		if (!$scope.selectedTemplate) {
			      alert = $mdDialog.alert({
        title: 'Error',
        textContent: 'Please select a template',
        ok: 'Close'
      });
			return;

		}
			var data = {};
			data["userId"] = $scope.userId;
			data.templateId =  $scope.selectedTemplate.id;
				$shared.changingPage = true;
			Backend.post("/provisionCallSystem", data).then(function( res ) {
				$shared.changingPage = false;
				doSpinup();
				return;
			});
		return false;
	}

	$scope.recall = function() {
		var data = angular.copy( $scope.verify1 );
		data.userId = $scope.userId;
				$shared.changingPage = true;
		Backend.post("/registerSendVerify", data).then(function( res ) {
				$shared.changingPage = false;
           $mdToast.show(
          $mdToast.simple()
            .textContent('You will be called shortly.')
            .position("top right")
            .hideDelay(3000)
		);
		   });
	}
    $scope.authenticate = function() {

    	var defer = $q.defer();

    	$timeout(function(){

    		defer.resolve();

    		$timeout(function(){
    		   	$location.path('/dashboard/home');
    		}, 600);

    	}, 1100);

    	return defer.promise;

	}
	    $scope.useTemplate = function (template) {
      $scope.selectedTemplate = template;
    };
    $scope.isSelected = function (template) {
      if ($scope.selectedTemplate && template.id === $scope.selectedTemplate.id) {
        return true;
      }
      return false;
    }
	$scope.gotoLogin= function() {
		$shared.changingPage = true;
		$shared.scrollToTop();
    	$state.go('login');
	}



	Backend.get("/getCallSystemTemplates").then(function(res) {
		$scope.templates = res.data;
		$shared.changingPage = false;
		if ( $stateParams['hasData'] ) {
			console.log("$stateParams data is ", $stateParams);
			$scope.token = $stateParams['authData'];

			$scope.userId = $stateParams['userId'];
			$scope.step = 2;
		}
	});
  });
