'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingUpgradeSubmitCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $stateParams, $mdToast, $mdDialog, $window) {
		var stripeElements;
		var stripeCard;
		var stripe;

	  $shared.updateTitle("Billing Upgrade Submit");


	$scope.settings = {
		newCard: false,
		type: 'CARD'
	};
	$scope.data = {
		selectedCard: null,
		selectedCardObj: null,
		creditAmount: null

	};
	$scope.card = {
		name: "",
		address: "",
		city: "",
		postal_code: "",
		number: "",
		expires: "",
		cvv: ""
	};

		function submitBilling(cardId, amount) {
			var data = {};
			data['card_id'] = cardId;
			data['plan']=  $stateParams['plan'];
			$shared.isCreateLoading =true;
			Backend.post("/upgradePlan", data).then(function(res) {
				console.log("upgraded plan..");
				$state.go('billing-upgrade-complete', {});
			});
			//$state.go('billing-upgrade-complete', {});
	}
		function storePaymentMethod(paymentMethod) {
			return $q(function(resolve, reject) {
				var data = {};
				data['payment_method_id'] = paymentMethod.id;
				data['last_4'] = paymentMethod.card.last4;
				data['issuer'] = paymentMethod.card.brand;
				$shared.isCreateLoading =true;

				Backend.post("/card", data).then(function(res) {
					resolve(res);
					$shared.endIsCreateLoading();
				}, function(err) {
					console.error("an error occured ", err);
				});
			});
		}



  async function initializePaymentGateway() {
    return new Promise(async (resolve, reject) => {
      switch ($shared.customizations.payment_gateway) {
        case 'stripe': {
			console.log('initializing stripe client');
          //Stripe.setPublishableKey($shared.frontend_api_creds.stripe_pub_key);
		  stripe = Stripe($shared.frontend_api_creds.stripe_pub_key);
          resolve();
        }
        default: {
          reject();
        }
      }
    });
  }


		function setupStripeElements() {
			console.log('setupStripeElements called');
			// Create an instance of Elements.
			stripeElements = stripe.elements();

			var fontColor = '#CCCCCC';
			var isDarkMode = false;
			if (isDarkMode) {
				fontColor = '#ffffff';
			}
			// Custom styling can be passed to options when creating an Element.
			var style = {
				base: {
					color: fontColor,
					fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
					fontSmoothing: 'antialiased',
					fontSize: '16px',
					'::placeholder': {
						color: '#aab7c4'
					}
				},
				invalid: {
					color: '#fa755a',
					iconColor: '#fa755a'
				}
			};

			// Create an instance of the card Element.
			stripeCard = stripeElements.create('card', {style: style});

			// Add an instance of the card Element into the `card-element` <div>.
			stripeCard.mount('#card-element');

			// Handle real-time validation errors from the card Element.
			stripeCard.on('change', function(event) {
				if (event.error) {
					// Show the errors on the form
					$scope.errorMsg = event.error.message;
					//angular.element('.add-card-form').scrollTop(0)
				} else {
					$scope.errorMsg = null;
				}
			});
		}

		async function createPaymentMethod() {
			console.log('createPaymentMethod called');
			const name = $scope.card.name;

			console.log('createPaymentMethod users name: ' + name);

			try {
				const result = await stripe.createPaymentMethod({
					type: 'card',
					card: stripeCard,
					billing_details: {
						name: name,
					},
				})
				console.log('createPaymentMethod result ', result)

				// Handle result.error or result.paymentMethod
				const { paymentMethod, error } = result;
				if (error) {
					// Display error to user
					console.error('createPaymentMethod error', error.message);
					console.error(error);
					return Promise.reject(error.message);
				}

				return Promise.resolve( paymentMethod );
			} catch ( err ) {
				console.error('createPaymentMethod error', err);
				console.error(err);
				return Promise.reject( err );
			}
		}

		function loadData(createLoading) {
			if (createLoading) {
				$shared.isCreateLoading = true;
			} else {
				$shared.isLoading = true;
			}
			return $q(function (resolve, reject) {
				$q.all([
					Backend.get("/billing"),
					Backend.get("/getServicePlans")
				]).then(function (res) {
					console.log("finished loading..");
					$scope.billing = res[0].data[0];
					$scope.cards = res[0].data[1];
					$scope.config = res[0].data[2];
					$scope.usageTriggers = res[0].data[4];
					$scope.plan = res[1].data.find(function (obj) {
						return obj.key_name == $stateParams['plan'];
					});
					console.log("config is ", $scope.config);
					initializePaymentGateway().then(() => {
						console.log("billing data is ", $scope.billing);
						console.log("cards are ", $scope.cards);
						console.log("settings are ", $scope.settings);
						console.log("usage triggers are ", $scope.usageTriggers);
						if (createLoading) {
							$shared.endIsCreateLoading();
						} else {
							$shared.endIsLoading();
						}

						// setup stripe
						setupStripeElements();
						resolve(res);
					}, reject);
				}, reject);
			});
		}


	function DialogController($scope, $timeout, $mdDialog, onSuccess, onError, $shared) {
		$scope.$shared = $shared;
		$scope.card = {
			name: "",
			address: "",
			city: "",
			postal_code: "",
			number: "",
			expires: "",
			cvv: ""
		};
		function stripeResponseHandler(status, response) {
			$timeout(function() {
				$scope.$apply();
				if (response.error) { // Problem!
					// Show the errors on the form
					$scope.errorMsg = response.error.message;
					angular.element('.add-card-form').scrollTop(0);
				} else { // Token was created!
					// Get the token ID:
					$mdDialog.hide();
					onSuccess(response);
				}
			}, 0);
		}

		$scope.cancel = function() {
			$mdDialog.cancel();
		}
		$scope.submit = function() {
			var data = {};
			/*
			data['number'] = $scope.card.number;
			data['cvc'] = $scope.card.cvv;
			var splitted = $scope.card.expires.split("/");
			data['exp_month'] = splitted[ 0 ];
			data['exp_year'] = splitted[ 1 ];
			data['address_zip'] = $scope.card.postal_code;
			Stripe.card.createToken(data, stripeResponseHandler);
			*/
			createPaymentMethod().then((paymentMethod) => {
				onSuccess(response);
			}, function( error ) {
				// Show the errors on the form
				$scope.errorMsg = response.error.message;
				angular.element('.add-card-form').scrollTop(0);

			});

		}
	}
	$scope.changeCard = function(value) {
		console.log("changeCard ", value);
		$scope.data.selectedCard = value;
		if (value === 'new') {
			$scope.settings.newCard = true;
		} else {
			$scope.settings.newCard = false;
			angular.forEach($scope.cards, function(card) {
				if ( card.id === value ) {
					$scope.data.selectedCardObj = card;
				}
			});
		}
		console.log("selected card ", $scope.data.selectedCardObj);
	}
	$scope.canCheckout = function() {
		if ($scope.data.selectedCard || $scope.settings.newCard) {
			return true;
		}
		return false;

	}
	$scope.completeUpgrade = function() {
		var data = {};
		console.log("card is ", $scope.data.selectedCard);
		console.log("amount is ", $scope.data.creditAmount);
		if (!$scope.data.selectedCard) {
			return;
		}
		if ($scope.data.selectedCard === 'new') {
			var data = {};
			createPaymentMethod().then((paymentMethod) => {
				$mdDialog.hide();
				storePaymentMethod(paymentMethod).then(function(res) {
					var cardId = res.headers('X-Card-ID');
					$timeout(function() {
						$scope.$apply();
						submitBilling(cardId);
					}, 0);
				})
			}, function( error ) {
				// Show the errors on the form
				$scope.errorMsg = response.error.message;
			});

			return;
		}
		$timeout(function() {
			$scope.$apply();
			submitBilling($scope.data.selectedCard);
		}, 0);
	}


	$scope.addCard = function($event) {
		function onSuccess(response) {
			storePaymentMethod(response).then(function() {
				loadData(true);
			});
		}
		function onError() {

		}
		$mdDialog.show({
			controller: DialogController,
			templateUrl: '/views/dialogs/add-card.html',
			parent: angular.element(document.body),
			targetEvent: $event,
			clickOutsideToClose:true,
			locals: {
				onSuccess: onSuccess,
				onError: onError
			}
		}).then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});

	}

	loadData(true).then(function(res) {
		console.log("plans ", res.data);
	  });
  });
