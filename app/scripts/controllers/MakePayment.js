'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('MakePaymentCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	var stripeElements;
	var stripeCard;
	var stripe;
	$shared.updateTitle("Make Payment");
	$scope.$shared = $shared;
	$scope.triedSubmit = false;
	$scope.isTabLoaded = false;
	$scope.startDate = moment().startOf('month').toDate();
	$scope.endDate = moment().endOf('month').toDate();
	$scope.cards = [];
	$scope.selectedAmount = 25.00;
	$scope.creditAmounts = [
		{"name": "$10", "value": 10.00},
		{"name": "$25", "value": 25.00},
		{"name": "$75", "value": 75.00},
		{"name": "$100", "value": 100.00},
		{"name": "$250", "value": 250.00},
	];
	$scope.settings = {
		newCard: false,
		type: 'CARD'
	};
	$scope.data = {
		selectedCard: null,
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

	$timeout(function() {
        $scope.isTabLoaded = true;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
    }, 1000); 

    function TriggerDialogController($scope, $mdDialog,$shared, onCreate) {
      $scope.$shared = $shared;
	  $scope.data = {
		  percentage: "10%"
	  };
	  $scope.percentages = [];
	  var start = 10;
	  while (start <= 90) {
		$scope.percentages.push(start.toString()+"%");
		start += 10;
	  }

	  $scope.triggerTypes = ['Balance'];
      $scope.close = function() {
        $mdDialog.hide();
	  }

	  $scope.save = function() {
		var data = angular.copy($scope.data);
		Backend.post("/addUsageTrigger", data).then(function(res) {
			$scope.close();
			onCreate();
		});
	  }
    }

	function toCents(dollars) {
		return dollars * 100;
	}

	function submitCredit(cardId, amount) {
		var data = {};
	data['card_id'] = cardId;
	data['amount'] =  amount;
	$scope.data.creditAmount.value;
	$shared.isCreateLoading =true;
	Backend.post("/credit", data).then(function(res) {
		console.log("added credit amount");
				loadData(true).then(function() {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Added credits successfully')
						.position('top right')
						.hideDelay(3000)
					);

					$state.go('billing', {"frm": 'PS'});

						})
			});
			//$shared.endIsCreateLoading();
	}

	function stripeRespAddCard(response) {
		return $q(function(resolve, reject) {
			var data = {};
			data['card_token'] = response.id;
			data['stripe_card'] = response.card.id;
			data['last_4'] = response.card.last4;
			data['issuer'] = response.card.brand;
			$shared.isCreateLoading =true;
			Backend.post("/card", data).then(function(res) {
				resolve(res);
				$shared.endIsCreateLoading();
			}, function(err) {
				console.error("an error occured ", err);
			});
		});
	}

	function DialogController($scope, $timeout, $mdDialog, onSuccess, onError, $shared) {
		$scope.$shared = $shared;
		var varToWatch = angular.element(document.body).hasClass('md-dialog-is-shwoing');
		$scope.$watch(varToWatch, function(){
			console.log('setupStripeElements called');
			// Create an instance of Elements.
			// const appearance = {
			// 	theme: 'night',
			// 	labels: 'floating'
			//   };
			stripeElements = stripe.elements();
		
			// Custom styling can be passed to options when creating an Element.
			var style = {
				base: {
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
				},
				appearance:{
					theme: 'night'
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
					showPaymentError(event.error.message);
					//angular.element('.add-card-form').scrollTop(0)
				} else {
					$scope.paymentErrorMsg = null;
				}
			});
		})
		$scope.card = {
			name: "",
			address: "",
			city: "",
			postal_code: "",
			number: "",
			expires: "",
			cvv: ""
		};

		// function stripeResponseHandler(status, response) {
		// 	$timeout(function() {
		// 		$scope.$apply();
		// 		if (response.error) { // Problem!
		// 			// Show the errors on the form
		// 			$scope.errorMsg = response.error.message;
		// 			angular.element('.add-card-form').scrollTop(0);
		// 		} else { // Token was created!
		// 			// Get the token ID:
		// 			$mdDialog.hide();
		// 			onSuccess(response);
		// 		}
		// 	}, 0);
		// }

		$scope.cancel = function() {
			$mdDialog.cancel();
		}

		$scope.submit = async function() {
			const paymentMethod = await createPaymentMethod();
			// Stripe.card.createToken(data, stripeResponseHandler);
			// stripe.createToken(stripeCard).then(function(result){
			// 	if(result.error){
			// 		document.getElementById('card-errors').textContent = result.error;
			// 	} else {
					// console.log(result.token);
					$shared.isCreateLoading =true;
					var data = {};
					data['issuer'] = paymentMethod.card.brand;
					data['last_4'] = paymentMethod.card.last4;
					data['stripe_id'] = paymentMethod.id;
					data['payment_method_id'] = paymentMethod.id;
					Backend.post("/card", data).then(function(res) {
						// resolve(res);
						$mdDialog.hide();
						console.log(res);
						loadData(true);
						$shared.endIsCreateLoading();
						$mdToast.show(
							$mdToast.simple()
							.textContent('Card added successfully.')
							.position("top right")
							.hideDelay(3000)
						);
					}, function(err) {
						$mdDialog.hide();
						$shared.endIsCreateLoading();
						console.error("an error occured ", err);
						$mdToast.show(
							$mdToast.simple()
							.textContent('Card was declined, Please try to add another card.')
							.position("top right")
							.hideDelay(3000)
						);
					});
			// 	}
			// })
		}
		async function createPaymentMethod(paymentDetails) {
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

		async function initializePaymentGateway() {
			return new Promise(async (resolve, reject) => {
			  switch ($shared.customizations.payment_gateway) {
				case 'stripe': {
				  stripe = Stripe($shared.frontend_api_creds.stripe_pub_key);
				  resolve();
				}
				default: {
				  reject();
				}
			  }
			});
		}

		initializePaymentGateway();

	}

	$scope.createLabel = function(card) {
		return "**** **** **** " + card.last_4;
	}
	$scope.addCard = function($event) {
		function onSuccess(response) {
			stripeRespAddCard(response).then(function() {
				loadData(true);
			});
		}
		function onError(err) {
			console.log('Payment card add error: '+ err);
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

	$scope.addCredit = function() {
		var data = {};
		console.log("card is ", $scope.data.selectedCard);
		console.log("amount is ", $scope.data.creditAmount);
		if (!$scope.data.creditAmount) {
			$mdToast.show(
				$mdToast.simple()
				.textContent('Please select a card.')
				.position('top right')
				.hideDelay(3000)
			);
			return;
		}

		$timeout(function() {
			$scope.$apply();
			submitCredit($scope.data.selectedCard, $scope.data.creditAmount.value);
		}, 0);

	}

	$scope.addCreditPayPal = function() {
		var data = {};
		console.log("card is ", $scope.data.selectedCard);
		console.log("amount is ", $scope.data.creditAmount);
		data.amount = $scope.data.creditAmount.value;
		$shared.isCreateLoading =true;
		Backend.post("/credit/checkoutWithPayPal", data).then(function(res) {
			var data = res.data;
			//$window.replace(data.url);
			//$window.location.href = data.url;
			$window.open(data.url, '_blank');
			$shared.endIsCreateLoading();
		});
	}

	$scope.getCardOptions = function() {
		var options = angular.copy($scope.cards);
		//options.push({""})
	}

	$scope.changeCard = function(value) {
		console.log("changeCard ", value);
		$scope.data.selectedCard = value;
		if (value === 'new') {
			$scope.settings.newCard = true;
		} else {
			$scope.settings.newCard = false;
		}
	}

	$scope.changeBillingPackage = function(newPackage) {
		console.log("changeBillingPackage ", newPackage);
		$scope.settings.billing_package = newPackage;
	}

	$scope.changeAmount = function(value) {
		console.log("changeAmount ", value);
		$scope.data.creditAmount = value;
	}

	$scope.changeAutoRechargeAmount = function(value) {
		console.log("changeAutoRechargeAmount ", value);
		$scope.settings.db.auto_recharge_top_up = value;
	}

	$scope.changeType = function(newType) {
		$scope.settings.type = newType;
	}

	$scope.saveSettings = function() {
		var data = {};
		data['auto_recharge'] = $scope.settings.db.auto_recharge;
		data['invoices_by_email'] = $scope.settings.db.invoices_by_email;
		data['billing_package'] = $scope.settings.db.billing_package;
		var recharge = $scope.settings.db.auto_recharge_top_up.value;
		data['auto_recharge_top_up'] = toCents(recharge);
		console.log("recharge in cents is ", data['auto_recharge_top_up']);
		$shared.isCreateLoading =true;
		Backend.post("/changeBillingSettings", data).then(function(res) {
			$mdToast.show(
			$mdToast.simple()
				.textContent('Saved billing settings')
				.position("top right")
				.hideDelay(3000)
			);
			$shared.endIsCreateLoading();
			});
	}

	$scope.cancelSubscription = function($event) {
		$state.go('billing-cancel-subscription', {});
	}

	function billHistory() {
		return 	Backend.get("/getBillingHistory?startDate=" + formatDate($scope.startDate, true) + "&endDate=" + formatDate($scope.endDate, true));
	}

	$scope.filterBilling = function() {
		$shared.isCreateLoading = true;
		billHistory().then(function(res) {
				$scope.history = res.data;
				$shared.endIsCreateLoading();
		});
	}

	$scope.downloadBilling = function() {
		var token = getJWTTokenObj();
		$window.location.replace(createUrl("/downloadBillingHistory?startDate=" + formatDate($scope.startDate, true) + "&endDate=" + formatDate($scope.endDate, true) + "&auth=" + token.token.auth));
	}

	$scope.makeNicePackageName = function(ugly) {
		var map = {
			"gold": "Gold Route",
			"silver": "Silver Route",
			"bronze": "Bronze Route",
		};
		return map[ugly];
	}

	function loadData(createLoading) {
		if (createLoading) {
			$shared.isCreateLoading =true;
		} else {
			$shared.isLoading =true;
		}

		return $q(function(resolve, reject) {
			$q.all([
				Backend.get("/billing"),
				billHistory()
			]).then(async function(res) {
				console.log("finished loading..");
				$scope.billing = res[0].data[0];
				$scope.settings.db = res[0].data[0].info.settings;
				var compare = parseFloat( $scope.settings.db.auto_recharge_top_up_dollars );

				if ($scope.settings.db.auto_recharge_top_up) {
					for ( var index in $scope.creditAmounts ) {
						var amount = $scope.creditAmounts[ index ];
						console.log("comparing amount ", amount, compare);
						if (amount.value === compare) {
							$scope.settings.db.auto_recharge_top_up = amount;
						}
					}
				}
				$scope.cards = res[0].data[1];
				$scope.config = res[0].data[2];
				$scope.usageTriggers = res[0].data[4];
				$scope.history = res[1].data;
				console.log("config is ", $scope.config);
				console.log("billing data is ", $scope.billing);
				console.log("cards are ", $scope.cards);
				console.log("settings are ", $scope.settings);
				console.log("usage triggers are ", $scope.usageTriggers);
				$scope.creditAmount = $scope.creditAmounts[0];
				if (createLoading) {
					$shared.endIsCreateLoading();
				} else {
					$shared.endIsLoading();
				}
				resolve();
				// await initializePaymentGateway();
			}, reject);
		});
	}

	$scope.createTrigger = function($event) {
		$mdDialog.show({
		controller: TriggerDialogController,
		templateUrl: 'views/dialogs/create-trigger.html',
		parent: angular.element(document.body),
		targetEvent: $event,
		clickOutsideToClose:true,
		fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
		locals: {
			"onCreate": function() {
				loadData(false).then(function() {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Usage trigger create..')
						.position("top right")
						.hideDelay(3000)
					);
				});
			}
		}
		})
		.then(function() {
		}, function() {
		});

	}

	$scope.setPrimary = function(card){
      Backend.put("/card/" + card.id + "/setPrimary").then(function() {
				loadData(true).then(function() {
		 $mdToast.show(
          $mdToast.simple()
            .textContent('Set card as primary')
            .position("top right")
            .hideDelay(3000)
		);
		 });
          });
	}

	// $scope.deleteCard = function(card){
    //   Backend.delete("/card/" + card.id).then(function() {
	// 			loadData(true).then(function() {
	// 	 $mdToast.show(
    //       $mdToast.simple()
    //         .textContent('Removed card successfully..')
    //         .position("top right")
    //         .hideDelay(3000)
	// 	);
	// 	 });
    //       });
	// }
	$scope.deleteCard = function($event, card)
	{
		if(card.primary === 1){
			$mdToast.show(
				$mdToast.simple()
				.textContent('Primary card can not be deleted')
				.position("top right")
				.hideDelay(3000)
			);
		}else{
		 	var confirm = $mdDialog.confirm()
			.title('Are you sure you want to remove card ?')
			.textContent('This will permantely remove the card from your added card list')
			.ariaLabel('Delete card')
			.targetEvent($event)
			.ok('Yes')
			.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$shared.isLoading = true;
				Backend.delete("/card/" + card.id).then(function() {
					loadData(true).then(function() {
						$shared.endIsLoading();
						$mdToast.show(
							$mdToast.simple()
							.textContent('Removed card successfully..')
							.position("top right")
							.hideDelay(3000)
						);
					});
				})
			}, function() {
			});
		}
	}

	$scope.deleteUsageTrigger = function($event, item) {
	// Appending dialog to document.body to cover sidenav in docs app
	console.log("deleteUsageTrigger ", item);
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this usage trigger?')
          .textContent('you will no longer be reminded when this usage trigger\'s conditions are met')
          .ariaLabel('Delete usage trigger')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/delUsageTrigger/" + item.id).then(function() {
          loadData(false).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Usage trigger deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
	}

	$scope.upgradePlan = function() {
    	$state.go('billing-upgrade-plan', {});
	}

	$scope.selectAmount = function(amount) {
		console.log('selectAmount ', amount)
		if(amount === 0){
			$scope.active_custom = true;
			$scope.selectedAmount = amount;
			// $scope.selectedAmount = $scope.custom_amount;
		}else{
			$scope.active_custom = false;
			$scope.selectedAmount = amount;
		}
	}

	$scope.changeCustoAmount = function(cus_amount) {
		$scope.selectedAmount = parseInt(cus_amount);
	}

	loadData(false);
  });
