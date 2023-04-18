'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('RegisterCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle, $stateParams, $mdDialog) {
	  $shared.updateTitle("Register");
		console.log("STATE ", $stateParams);
	  var countryToCode = {
		  US: "+1",
		  CA: "+1",
	  };
	  $scope.acceptTerms =true;
	  $scope.triedSubmit = false;
	  $scope.passwordsDontMatch = false;
	  $scope.shouldSplash = false;
	  $scope.didVerifyCall = false;
	  $scope.step = 1;
	  $scope.userId = null;
	  $scope.token = null;
	  $scope.invalidCode =false;
	  $scope.invalidNumber =false;
	  $scope.planInfo = null;
	$scope.hasWorkspaceNameErr = false;
	$scope.user = {
		first_name: "",
		last_name: "",
    mobile_number: "",
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
	$scope.card = {
		number: "",
		cvv: "",
		expires: "",
		name: "",
	};

  $scope.workspace = "";
  $scope.selectedTemplate = null;

  $scope.onNumberChange = function() {
    $scope.user.mobile_number = Number($scope.user.mobile_number.replace(/[^0-9]/g, '').slice(0, 10));
    if (!$scope.user.mobile_number) $scope.user.mobile_number = '';
  }

  function doSpinup() {
	$scope.shouldSplash = true;
	$shared.setAuthToken( $scope.token );
	var data = { "userId": $scope.userId, "plan": $stateParams['plan'] };
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

  	$scope.gotoVerificationFlow = function() {
				var verficationWorkflow = $shared.customizations['verification_workflow'];
				if ( verficationWorkflow === 'sms' ) {
					$scope.step = 2;
				} else {
					$scope.step = 3;
				}
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
				$scope.workspaceInfo = data.workspace;
				$shared.changingPage = false;
				$scope.gotoVerificationFlow();
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
	$scope.submitBillingForm = function($event, billingForm) {

		//setup tokens for workspace access
		$shared.setAuthToken($scope.token);
		$shared.setWorkspace($scope.workspace);


			var data = {};
			data['number'] = $scope.card.number;
			data['cvc'] = $scope.card.cvv;
			var splitted = $scope.card.expires.split("/");
			data['exp_month'] = splitted[ 0 ];
			data['exp_year'] = splitted[ 1 ];
			data['address_zip'] = $scope.card.postal_code;
			Stripe.card.createToken(data, stripeResponseHandler);
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
			data.plan = $stateParams['plan'];
			data.workspace = $scope.workspace;
				$shared.changingPage = true;
			Backend.post("/updateWorkspace", data).then(function( res ) {
				$shared.changingPage = false;
				if (res.data.success) {
					$scope.invalidWorkspaceTaken = false;
					//doSpinup();
					if ($stateParams['plan'] === 'pay-as-you-go') {
						$scope.step = 5;
					} else {
						//need to add card
						$scope.step = 4;
					}

					//$scope.step = 4;
					return;
				}
				$scope.invalidWorkspaceTaken = true;
				$scope.workspace = res.data.workspace;
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
		function stripeResponseHandler(status, response) {
			$timeout(function() {
				$scope.$apply();
				if (response.error) { // Problem!
					// Show the errors on the form
					$scope.billErrorMsg = response.error.message;
					//angular.element('.add-card-form').scrollTop(0);
				} else { // Token was created!
					// Get the token ID:
					$mdDialog.hide();
					stripeRespAddCard(response).then(function() {
						$scope.step = 4;
					});
				}
			}, 0);
		}
		function stripeRespAddCard(response) {
			return $q(function(resolve, reject) {
				var data = {};
				data['stripe_token'] = response.id;
				data['stripe_card'] = response.card.id;
				data['last_4'] = response.card.last4;
				data['issuer'] = response.card.brand;
				$shared.isCreateLoading =true;
				var qs = "?user_id=" + $scope.userId + "&workspace_id=" + $scope.workspaceInfo.id;
				Backend.post("/addCard" + qs, data).then(function(res) {
					resolve(res);
					$shared.endIsCreateLoading();
				}, function(err) {
					console.error("an error occured ", err);
				});
			});
		}

	$q.all([
		Backend.get("/getCallSystemTemplates"),
		Backend.get("/getConfig"),
		Backend.get("/plans"),
	]).then(function(res) {
		$scope.templates = res[0].data;
		$scope.plans = res[2].data;
		$shared.changingPage = false;
		console.log("plans ", $scope.plans);
		console.log("user selected plan is ", $stateParams['plan'] );
		if ( $stateParams['plan'] ) {
			$scope.planInfo = $scope.plans[ $stateParams['plan'] ];
		}
		console.log("plan info is ", $scope.planInfo);
		if ( $stateParams['hasData'] ) {
			console.log("$stateParams data is ", $stateParams);
			$scope.token = $stateParams['authData'];

			$scope.userId = $stateParams['userId'];
			$scope.gotoVerificationFlow();
		}
		$scope.config = res[1].data;
		console.log("config is ", $scope.config);
		Stripe.setPublishableKey($scope.config.stripe.key);

	});
  });
