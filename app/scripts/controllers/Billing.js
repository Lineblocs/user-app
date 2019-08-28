'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('BillingCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast, $mdDialog) {
	  $scope.SharedPref = SharedPref;
	  $scope.triedSubmit = false;
	$scope.cards = [];
	$scope.creditAmounts = [
		{"name": "$10", "value": 10.00},
		{"name": "$25", "value": 25.00},
		{"name": "$50", "value": 50.00},
		{"name": "$100", "value": 100.00},
		{"name": "$250", "value": 250.00}
	];
	$scope.settings = {
		newCard: false
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
		function submitBilling(cardId, amount) {
			var data = {};
		data['card_id'] = cardId;
		data['amount'] =  amount;
		$scope.data.creditAmount.value;
		Backend.post("/credit/addCredit", data).then(function(res) {
			console.log("added credit amount");
				$mdToast.show(
				$mdToast.simple()
					.textContent('Added credits successfully')
					.position('top right')
					.hideDelay(3000)
				);
				loadData();
				});
		}

		function stripeRespAddCard(response) {
			return $q(function(resolve, reject) {
				var data = {};
				data['stripe_token'] = response.id;
				data['stripe_card'] = response.card.id;
				data['last_4'] = response.card.last4;
				data['issuer'] = response.card.brand;
				Backend.post("/card/addCard", data).then(function(res) {
					resolve(res);
				}, function(err) {
					console.error("an error occured ", err);
				});
			});
		}

	function DialogController($scope, $timeout, $mdDialog, onSuccess, onError, SharedPref) {
		$scope.SharedPref = SharedPref;
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
			if (response.error) { // Problem!
				// Show the errors on the form
				$scope.errorMsg = response.error.message;

			} else { // Token was created!
				// Get the token ID:
				$mdDialog.hide();
				onSuccess(response);
			}
			$timeout(function() {
				$scope.$apply();
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
				loadData();
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
						submitBilling(cardId, $scope.data.creditAmount.value);
					})
				}
				$timeout(function() {
					$scope.$apply();
				}, 0);
			});
			return;
		}
		submitBilling($scope.data.selectedCard, $scope.data.creditAmount.value);

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
	$scope.changeAmount = function(value) {
		console.log("changeAmount ", value);
		$scope.data.creditAmount = value;
	}
	function loadData() {
		$q.all([
			Backend.get("/getBillingInfo"),
			Backend.get("/card/listCards?page=0"),
			Backend.get("/getConfig"),
			Backend.get("/getBillingHistory"),
		]).then(function(res) {
			$scope.billing = res[0].data;
			$scope.cards = res[1].data.data;
			$scope.config = res[2].data;
			$scope.history = res[3].data;
			console.log("config is ", $scope.config);
			Stripe.setPublishableKey($scope.config.stripe.key);
			console.log("billing data is ", $scope.billing);
			console.log("cards are ", $scope.cards);
			$scope.creditAmount = $scope.creditAmounts[0];
		});
	}
	loadData();
  });
