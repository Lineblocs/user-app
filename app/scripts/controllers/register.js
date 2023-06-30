'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
var paypal;
angular.module('Lineblocs')
  .controller('RegisterCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle, $stateParams, $mdDialog, $filter) {
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
    $scope.planPrice = null;
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
  $scope.paymentDetails = {
    payment_card: {
      payment_card_number: "",
      expiration_date: "",
      security_code: "",
      cardholder_name: ""
    },
    paypal: {
      name: "",
    },
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      postal_code: "",
    },
    accept_terms: false,
  };
	$scope.card = {
		number: "",
		cvv: "",
		expires: "",
		name: "",
	};
  $scope.paymentMethods = '';
  $scope.cardVisible = true;
  $scope.paypalVisible = false;
  $scope.paypalLoaded = false;
  const currentDate = new Date();
  const trialDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
  $scope.nextTrialDate = $filter('date')(trialDate, 'MMM dd, yyyy');
  $scope.chargeCurrentDate = $filter('date')(new Date(), 'MMM dd, yyyy');

  $scope.displayCard = function() {
    $scope.cardVisible = true;
    $scope.paypalVisible = false;
    $scope.paymentForm.$setPristine();
    $scope.paymentForm.$setUntouched();
  };

  $scope.displayPaypal = function() {
    $scope.cardVisible = false;
    $scope.paypalVisible = true;
    $scope.paymentForm.$setPristine();
    $scope.paymentForm.$setUntouched();
    renderPaypalButton();
  };

  $scope.workspace = "";
  $scope.selectedTemplate = null;

  $scope.onNumberChange = function() {
	if(!$scope.user.mobile_number) return;
    $scope.user.mobile_number = Number($scope.user.mobile_number.replace(/[^0-9]/g, '').slice(0, 10)); 
    if (!$scope.user.mobile_number) $scope.user.mobile_number = '';
  }

  $scope.cardNumberChange = function() {
    if (!$scope.paymentDetails || !$scope.paymentDetails.payment_card) return;
    if (!$scope.paymentDetails.payment_card.payment_card_number) return;
    $scope.paymentDetails.payment_card.payment_card_number = Number($scope.paymentDetails.payment_card.payment_card_number.replace(/[^0-9]/g, '').slice(0, 16));
    if (!$scope.paymentDetails.payment_card.payment_card_number) $scope.paymentDetails.payment_card.payment_card_number = '';
  }

  $scope.onSecurityCode = () => {
    if (!$scope.paymentDetails || !$scope.paymentDetails.payment_card) return;
    if (!$scope.paymentDetails.payment_card.security_code) return;
    $scope.paymentDetails.payment_card.security_code = Number($scope.paymentDetails.payment_card.security_code.replace(/[^0-9]/g, '').slice(0, 4));
    if (!$scope.paymentDetails.payment_card.security_code) $scope.paymentDetails.payment_card.security_code = '';
  }

  const patterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
  };
  const logos = {
    visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/40px-Visa_Inc._logo.svg.png',
    mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/40px-Mastercard-logo.svg.png',
    amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/40px-American_Express_logo.svg.png',
    discover: 'https://www.duplichecker.com/newassets1/images/cradit-card-validator/Discover.svg'
  };
  $scope.getCreditCardBrand = function (cardNumber) {
    if (!cardNumber) return null;
    cardNumber = cardNumber.toString().replace(/\D/g, '');

    for (const brand in patterns) {
      if (!patterns[brand].test(cardNumber)) continue;
      return {
        brand: brand,
        logo: logos[brand]
      };
    }
    return null;
  }
  $scope.changeCountry = function (country) {
    $scope.paymentDetails.address.country = country;
  }
  $scope.changeState = function (state) {
    $scope.paymentDetails.address.state = state;
  }
  $scope.checkoutTrial = function() {
    $scope.step = 6;

  }

  $scope.checkoutDashboard = function() {
    doSpinup();
  }

  $scope.validateExpirationDate = function(value) {
    if (!value) return true;
    value = value.replace(/[^0-9/]/g, '');
    let parts = value.split('/');
    if (parts[0].length > 2) parts[0] = parts[0].slice(0, 2);
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].slice(0, 2);
    $scope.paymentDetails.payment_card.expiration_date = parts.join('/');
    if (parts[0].length === 2 && parts.length === 1 && $scope.prevExpiry !== value + '/') {
      $scope.paymentDetails.payment_card.expiration_date = value + '/';
    }
    $scope.prevExpiry = $scope.paymentDetails.payment_card.expiration_date;
    if (parts[0] > 12 || parts[0] < 1 || parts[1] < 0 || parts[1] > 99) return false;
    let expirationDate = new Date('20' + parts[1], parts[0] - 1, 1);
    let currentDate = new Date();
    let lastDayOfMonth = new Date(expirationDate.getFullYear(), expirationDate.getMonth() + 1, 0).getDate();
    expirationDate.setDate(lastDayOfMonth);
    return expirationDate >= currentDate;
  };


  function doSpinup() {
	$scope.shouldSplash = true;
	$shared.setAuthToken( $scope.token );
	var data = { "userId": $scope.userId, "plan": $scope.plan.key_name };
	console.log("do spinup data ", data);
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

  $scope.selectPaymentMethod = function(method) {
    $scope.paymentMethod = method;
  };

  $scope.submitPaymentForm = function($event, paymentForm) {
    console.log("called click PaymentForm");
    $scope.triedSubmit = true;
    if(!$scope.paymentDetails.accept_terms) return;
    if(paymentForm.$valid) {
      if($scope.paymentMethod === 'card') {
        submitTrial();
        // $scope.step = 6;
        return;
      } else {
        $scope.step = 5;
      }
    }
  }

  async function submitTrial() {
    const response = await createCardToken($shared.customizations.payment_gateway, $scope.paymentDetails);
    const data = {};
    const billingAddress = {
      'addr1': $scope.paymentDetails.address.street,
      'addr2': $scope.paymentDetails.address.street,
      'country': $scope.paymentDetails.address.country.name,
      'zipcode': $scope.paymentDetails.address.postal_code,
    };
    data['payment_gateway'] = $shared.customizations.payment_gateway;
    data['billing_region_id'] = $scope.paymentDetails.address.state.id;
    data['billing_address'] = billingAddress;
    data['user_id'] = $scope.userId;
    data['workspace_id'] = $scope.workspaceInfo.id;
    data['payment_values'] = Object.assign({}, response);
    Backend.post("/saveCustomerPaymentDetails", data, true).then(function( res ) {
      console.log('saved payment details', res);
      $scope.step = 6;
    }).catch(function(err) {
      console.log('error saving payment details', err);
      $scope.step = 6;
    });
  }

  async function initializePaymentGateway() {
    return new Promise(async (resolve, reject) => {
      switch ($shared.customizations.payment_gateway) {
        case 'stripe': {
          Stripe.setPublishableKey($shared.frontend_api_creds.stripe_pub_key);
          resolve();
        }
        default: {
          reject();
        }
      }
    });
  }

  async function createCardToken(gateway, paymentDetails) {
    try {
      switch (gateway) {
        case 'stripe': {
          const expiry = paymentDetails.payment_card.expiration_date.split('/');
          const cardDetails = {
            number: paymentDetails.payment_card.payment_card_number,
            exp_month: expiry[0],
            exp_year: expiry[1],
            cvc: paymentDetails.payment_card.security_code,
            name: paymentDetails.payment_card.cardholder_name,
            address_line1: paymentDetails.address.street,
            address_city: paymentDetails.address.city,
            address_state: paymentDetails.address.state.name,
            address_zip: paymentDetails.address.postal_code,
            address_country: paymentDetails.address.country.name,
          };
          const response = await Stripe.card.createToken(cardDetails);
          return {card_token: response.id, last_4: response.card.last4};
        }
      }
    } catch (err) {

    }
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
			data["plan"] = $scope.plan.key_name;
			console.log("plan option is ", data.plan);
			data.workspace = $scope.workspace;
				$shared.changingPage = true;
			Backend.post("/setupWorkspace", data).then(function( res ) {
				$shared.changingPage = false;
				if (res.data.success) {
					$scope.invalidWorkspaceTaken = false;
					// doSpinup();
					$scope.step = 4;
					return;
				}
				$scope.invalidWorkspaceTaken = true;
				$scope.workspace = res.data.workspace;
			});
		}
		return false;
	}
	function getBestServicePlanOption() {
		var explicitPlan  = $stateParams['plan'];
		console.log("explicitPlan ", explicitPlan);

		if ( explicitPlan != null ) {
			return explicitPlan;
		}
		// get the default one from the API

		var featuredPlan = $scope.plans.filter((plan) => {
			if ( plan.featured_plan ) {
				return true;
			}
			return false;
		});
		console.log("featured plan ", featuredPlan);
		if ( featuredPlan.length > 0 ) {
			return featuredPlan[0];
		}

		// if no featured plan was found then use the first match.
		if ( $scope.plans.length > 0 ) {
			return $scope.plans[0];
		}

		// no plans are setup
		throw new Error("No service plan matches found");
	}
  function renderPaypalButton() {
    if ($scope.paypalLoaded) return;
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: $scope.planPrice
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
    }).render('#paypal-button-container');
    $scope.paypalLoaded = true;
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
        if ($shared.customizations.signup_requires_payment_detail) {
          $scope.step = 5;
        } else {
          doSpinup();
        }
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

  function load() {
    $q.all([
      Backend.get("/getCallSystemTemplates"),
      Backend.get("/getConfig"),
      Backend.get("/getServicePlans"),
    ]).then(async function (res) {
      $scope.templates = res[0].data;
	  $scope.plans = res[2].data;

	  var plan = getBestServicePlanOption();
	  $scope.plan = plan;
	  console.log("selected plan option is ", plan);
      $shared.changingPage = false;
      console.log("plans ", $scope.plans);
      $scope.planInfo = plan.nice_name;
      $scope.planPrice = plan.monthly_charge;
      console.log("user selected plan is ", $stateParams['plan'] );
      // if ( $stateParams['plan'] ) {
      // 	$scope.planInfo = $scope.plans[ $stateParams['plan'] ];
      // }
      console.log("plan info is ", $scope.planInfo);
      if ( $stateParams['hasData'] ) {
        console.log("$stateParams data is ", $stateParams);
        $scope.token = $stateParams['authData'];

        $scope.userId = $stateParams['userId'];
        $scope.gotoVerificationFlow();
      }
      $scope.config = res[1].data;
      console.log("config is ", $scope.config);
      await initializePaymentGateway();
    });
  }
  load();
  });
