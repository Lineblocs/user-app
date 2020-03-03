'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('BillingCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing");
	  $scope.$shared = $shared;
	  $scope.triedSubmit = false;
	  $scope.startDate = moment().startOf('month').toDate();
	  $scope.endDate = moment().endOf('month').toDate();
	$scope.cards = [];
	$scope.creditAmounts = [
		{"name": "$10", "value": 10.00},
		{"name": "$25", "value": 25.00},
		{"name": "$50", "value": 50.00},
		{"name": "$100", "value": 100.00},
		{"name": "$250", "value": 250.00}
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
		function submitBilling(cardId, amount) {
			var data = {};
		data['card_id'] = cardId;
		data['amount'] =  amount;
		$scope.data.creditAmount.value;
		$shared.isCreateLoading =true;
		Backend.post("/credit/addCredit", data).then(function(res) {
			console.log("added credit amount");
					loadData(true).then(function() {
						$mdToast.show(
						$mdToast.simple()
							.textContent('Added credits successfully')
							.position('top right')
							.hideDelay(3000)
						);

							})
				});
				//$shared.endIsCreateLoading();
		}

		function stripeRespAddCard(response) {
			return $q(function(resolve, reject) {
				var data = {};
				data['stripe_token'] = response.id;
				data['stripe_card'] = response.card.id;
				data['last_4'] = response.card.last4;
				data['issuer'] = response.card.brand;
				$shared.isCreateLoading =true;
				Backend.post("/card/addCard", data).then(function(res) {
					resolve(res);
					$shared.endIsCreateLoading();
				}, function(err) {
					console.error("an error occured ", err);
				});
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
			data['number'] = $scope.card.number;
			data['cvc'] = $scope.card.cvv;
			var splitted = $scope.card.expires.split("/");
			data['exp_month'] = splitted[ 0 ];
			data['exp_year'] = splitted[ 1 ];
			data['address_zip'] = $scope.card.postal_code;
			Stripe.card.createToken(data, stripeResponseHandler);

		}
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
	$scope.addCredit = function() {
		var data = {};
		console.log("card is ", $scope.data.selectedCard);
		console.log("amount is ", $scope.data.creditAmount);
		if (!$scope.data.selectedCard) {
			return;
		}
		if ($scope.data.selectedCard === 'new') {
			var data = {};
			data['number'] = $scope.card.number;
			data['cvc'] = $scope.card.cvv;
			var splitted = $scope.card.expires.split("/");
			data['exp_month'] = splitted[ 0 ];
			data['exp_year'] = splitted[ 1 ];
			data['address_zip'] = $scope.card.postal_code;
			Stripe.card.createToken(data, function (status, response) {
				if (response.error) { // Problem!
					// Show the errors on the form
					$scope.errorMsg = response.error.message;

				} else { // Token was created!
					// Get the token ID:
					$mdDialog.hide();
					stripeRespAddCard(response).then(function(res) {
						var cardId = res.headers('X-Card-ID');
						$timeout(function() {
							$scope.$apply();
							submitBilling(cardId, $scope.data.creditAmount.value);
						}, 0);
					})
				}
				$timeout(function() {
					$scope.$apply();
					submitBilling(cardId, $scope.data.creditAmount.value);
				}, 0);
			});
			return;
		}
		$timeout(function() {
			$scope.$apply();
			submitBilling($scope.data.selectedCard, $scope.data.creditAmount.value);
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
			$window.location.href = data.url;
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
		$window.location.replace(createUrl("/downloadBillingHistory?startDate=" + formatDate($scope.startDate, true) + "&endDate=" + formatDate($scope.endDate, true) + "&auth=" + token.token));
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
			]).then(function(res) {
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
				Stripe.setPublishableKey($scope.config.stripe.key);
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
	loadData(false);
  });
