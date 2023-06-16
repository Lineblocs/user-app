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
		function stripeRespAddCard(response) {
			return $q(function(resolve, reject) {
				var data = {};
				data['stripe_token'] = response.id;
				data['stripe_card'] = response.card.id;
				data['last_4'] = response.card.last4;
				data['issuer'] = response.card.brand;
				$shared.isCreateLoading =true;
				Backend.post("/card/", data).then(function(res) {
					resolve(res);
					$shared.endIsCreateLoading();
				}, function(err) {
					console.error("an error occured ", err);
				});
			});
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
				Backend.get("/getServicePlans")
			]).then(function(res) {
				console.log("finished loading..");
				$scope.billing = res[0].data[0];
				$scope.cards = res[0].data[1];
				$scope.config = res[0].data[2];
				$scope.usageTriggers = res[0].data[4];
				$scope.plan = res[1].data.find(function(obj) {
          return obj.key_name == $stateParams['plan'];
        });
				console.log("config is ", $scope.config);
				Stripe.setPublishableKey($scope.config.stripe.key);
				console.log("billing data is ", $scope.billing);
				console.log("cards are ", $scope.cards);
				console.log("settings are ", $scope.settings);
				console.log("usage triggers are ", $scope.usageTriggers);
				if (createLoading) {
					$shared.endIsCreateLoading();
				} else {
					$shared.endIsLoading();
				}
				resolve(res);
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
			data['number'] = $scope.card.number;
			data['cvc'] = $scope.card.cvv;
			var splitted = $scope.card.expires.split("/");
			data['exp_month'] = splitted[ 0 ];
			data['exp_year'] = splitted[ 1 ];
			data['address_zip'] = $scope.card.postal_code;
			Stripe.card.createToken(data, stripeResponseHandler);

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
							submitBilling(cardId);
						}, 0);
					})
				}
				$timeout(function() {
					$scope.$apply();
					submitBilling(cardId);
				}, 0);
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

	loadData(true).then(function(res) {
		console.log("plans ", res.data);
	  });
  });
