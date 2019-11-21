'use strict';

/**
* @ngdoc overview
* @name MaterialApp
* @description
* # MaterialApp
*
* Main module of the application.
*/
window.app_version = 2.0;

function checkExpires(expiresIn)
{

}
function getJWTToken() {
    var token = localStorage.getItem("AUTH");
    if (token) {
            var parsed = JSON.parse(token);
            return "Bearer " + parsed.token;
    }
    return "";
}
var href = document.location.href.includes("http://localhost");
if (href) {
    var baseUrl = "http://lineblocs.com/api";
} else {
    var baseUrl = "/api";
}
function createUrl(path) {
    return baseUrl + path;
}
        
function generatePassword() {
    var length = 32,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
angular
.module('MaterialApp', [
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'chart.js',
    'pascalprecht.translate',
    'md.data.table',
    'ngIdle'
    ])
    .service('JWTHttpInterceptor', function() {
        return {
            // optional method
            'request': function(config) {
                // do something on success
                var token = localStorage.getItem("AUTH");
                if (token) {
                    config.headers['Authorization'] = getJWTToken(); 
                }
                console.log("request headers are ", config.headers);
                return config;
            }
        };
    })
    .factory("SharedPref", function($state, $mdDialog, $timeout, $q, $window) {
        var factory = this;
        var baseTitle = "LineBlocs.com";
        factory.title = baseTitle;
        factory.FLOW_EDITOR_URL = "http://editor.lineblocs.com";
        factory.SHOW_NAVBAR = true;
        factory.PAGE_CONTENT_NO_PADDING = false; 
        factory.isLoading = true;
        factory.billingCountries = [
    {
       iso: 'CA',
       name: 'Canada'
    },
    {
       iso: 'US',
       name: 'United States'
    }
  ];
  var flickerTimeout = 0;
  factory.endIsLoading = function() {
      return $q(function(resolve, reject) {
        $timeout(function() {
            factory.isLoading = false;
            resolve();
        }, flickerTimeout);
    });
  }
    factory.endIsCreateLoading = function() {
      return $q(function(resolve, reject) {
        $timeout(function() {
            factory.isCreateLoading = false;
            resolve();
        }, flickerTimeout);
    });
  }

  factory.changeRoute = function(route, params) {
      console.log("changeRoute called ", arguments);
      var params = params || {};
      var except = ['flow-editor'];
      if (factory.state && factory.state.name === route) {
        return;
      }
      if (!except.includes(route)) {
        factory.isLoading = true;
      }
      $state.go(route, params)
      $timeout(function() {

      }, 0);
  }
        factory.collapseNavbar = function() {
            factory.SHOW_NAVBAR = false;
            factory.PAGE_CONTENT_NO_PADDING = true;
            $( '.c-hamburger' ).removeClass('is-active');
            $('body').removeClass('extended');
        }
        factory.showNavbar = function() {
            factory.SHOW_NAVBAR = true;
            factory.PAGE_CONTENT_NO_PADDING = false;
            $( '.c-hamburger' ).addClass('is-active');
            $('body').addClass('extended');
        }
        factory.doLogout = function() {
            localStorage.removeItem("AUTH");
            $state.go('login', {});
        }
        factory.setAuthToken = function(token) {
            localStorage.setItem("AUTH", JSON.stringify(token));
        }
        factory.getAuthToken = function() {
            return JSON.parse(localStorage.getItem("AUTH"));
        }
        factory.showError = function(title, msg) {
                $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(msg)
                    .ariaLabel(title)
                    .ok('Ok')
                );

        }
        factory.updateTitle = function(text) {
            factory.title = baseTitle;
            if (text) {
                   factory.title = baseTitle + " - " + text;
            }
        }
        factory.scrollTop = function() {
            $window.scrollTo(0, 0);
        }
        return factory;
    })
    .factory("Backend", function($http, $q, SharedPref) {
        var factory = this;
        function errorHandler(error) {
            SharedPref.showError("An error occured.");
        }
        factory.getJWTToken = function(email, password) {
            var params = {
                email: email,
                password: password
            };
            return $q(function(resolve, reject) {
                $http.post( createUrl( "/jwt/authenticate"), params).then( function(res) {
                    localStorage.setItem("AUTH", JSON.stringify(res.data));
                    resolve();
                }).catch(function(err) {
                    reject( err );
                });
            });
        }
        factory.get = function(path, params)
        {
            return $q(function(resolve, reject) {
                $http.get(createUrl(path), params).then(resolve,function(err) {
                    errorHandler();
                    reject(err);
                 });
            });
        }
        factory.getPagination = function(path, params)
        {
            path = path + "?page=" + pagination.settings.currentPage;
            return factory.get(path, params);
        }

        factory.delete = function(path)
        {
            return $q(function(resolve, reject) {
                $http.delete(createUrl(path)).then(resolve,function(err) {
                    errorHandler();
                    reject(err);
                 });
            });

        }
        factory.post = function(path, params, suppressErrDialog)
        {
            return $q(function(resolve, reject) {
                $http.post(createUrl(path), params).then(resolve,function(err) {
                    if (!suppressErrDialog) {
                        errorHandler();
                    }
                    reject(err);
                 });
            });

        }
        return factory;
    })
    .factory("pagination", function(Backend,SharedPref, $q) {
        var factory = this;
        factory.settings = {
            currentPage: 1,
            currentUrl: "",
            scope: { obj: null, key: '' }
        };
        factory.meta = {}; // saved by backend
        factory.nextPage = function() {
            factory.settings.currentPage = factory.settings.currentPage + 1;
            factory.loadData();
        }
        factory.prevPage = function() {
            factory.settings.currentPage = factory.settings.currentPage - 1;
            factory.loadData();
        }
        factory.hasNext = function() {
            console.log("hasNext meta is ", factory.meta);
            var current = factory.settings.currentPage;
            if (current === factory.meta.pagination.total_pages) {
                return false;
            }
            console.log("we have next");
            return true;
        }
        factory.hasPrev = function() {
            var current = factory.settings.currentPage;
            if (current === 1) {
                return false;
            }
            return true;
        }


        factory.changePage = function( page ) {
            factory.settings.currentPage = page;
        }
        factory.changeUrl = function( url ) {
            factory.settings.currentUrl = url;
        }
        factory.changeScope = function( obj, key ) {
            factory.settings.scope = {
                obj: obj, 
                key: key
            }
        }
        factory.loadData = function() {
            var url = factory.settings.currentUrl + "?page=" + factory.settings.currentPage;
            SharedPref.isCreateLoading = true;
            return $q(function(resolve, reject) {
                Backend.get(url).then(function(res) {
                    var meta = res.data.meta;
                    factory.meta = meta;
                    var scopeObj = factory.settings.scope.obj
                    var key = factory.settings.scope.key;
                    scopeObj[ key ] = res.data.data;
                    SharedPref.endIsCreateLoading();
                    resolve(res);
                });
            });
        }
        factory.gotoPage = function( page ) {
            factory.changePage( page );
            factory.loadData();
        }
        return factory;
    })
    .config(['$httpProvider', function($httpProvider) {
         $httpProvider.interceptors.push('JWTHttpInterceptor');

    }])
      
    .config(function(IdleProvider, KeepaliveProvider) {
        IdleProvider.idle(900); // 15 min
        IdleProvider.timeout(60);
        KeepaliveProvider.interval(600); // heartbeat every 10 min
        /*
        KeepaliveProvider.http({
            method: 'GET',
            url: createUrl('/jwt/heartbeat'),
            headers: {
                "Authorization": getJWTToken
            } 
        }); // URL that makes sure session is alive
        */
    })
    .config(function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
          prefix: 'languages/',
          suffix: '.json'
        });
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('en');       
    })

    .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/home');
    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
    .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html',
        controller: 'DashboardCtrl'
    })
    .state('login', {
        url: '/login',
        parent: 'base',
        templateUrl: 'views/pages/login.html',
        controller: 'LoginCtrl'
    })
    .state('register', {
        url: '/register',
        parent: 'base',
        templateUrl: 'views/pages/register.html',
        controller: 'RegisterCtrl'
    })
    .state('forgot', {
        url: '/forgot',
        parent: 'base',
        templateUrl: 'views/pages/forgot.html',
        controller: 'ForgotCtrl'
    })
    .state('reset', {
        url: '/reset',
        parent: 'base',
        templateUrl: 'views/pages/reset.html',
        controller: 'ResetCtrl'
    })

    .state('404', {
        url: '/404-page',
        parent: 'base',
        templateUrl: 'views/pages/404-page.html',
    })
    .state('dashboard', {
        url: '/dashboard',
        parent: 'base',
        templateUrl: 'views/layouts/dashboard.html',
        controller: 'DashboardCtrl'
    })
    .state('dashboard-user-welcome', {
        url: '/dashboard/welcome',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard-welcome.html',
        controller: 'DashboardWelcomeCtrl'
    })
    .state('my-numbers', {
        url: '/dids/my-numbers',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/my-numbers.html',
        controller: 'MyNumbersCtrl'
    })
    .state('my-numbers-edit', {
        url: '/dids/my-numbers/{numberId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/my-numbers-edit.html',
        controller: 'MyNumbersEditCtrl'
    })
    .state('buy-numbers', {
        url: '/dids/buy-numbers',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/buy-numbers.html',
        controller: 'BuyNumbersCtrl'
    })
    .state('flows', {
        url: '/flows',
        parent: 'dashboard',
        templateUrl: 'views/pages/flows.html',
        controller: 'FlowsCtrl'
    })
    .state('flow-editor', {
        url: '/flows/{flowId}',
        parent: 'dashboard',
        templateUrl: 'views/pages/flow-editor.html',
        controller: 'FlowEditorCtrl'
    })
    .state('extensions', {
        url: '/extensions',
        parent: 'dashboard',
        templateUrl: 'views/pages/extensions.html',
        controller: 'ExtensionsCtrl'
    })
    .state('extension-create', {
        url: '/extension/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/extension-create.html',
        controller: 'ExtensionCreateCtrl'
    })
    .state('extension-edit', {
        url: '/extension/{extensionId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/extension-edit.html',
        controller: 'ExtensionEditCtrl'
    })
    .state('calls', {
        url: '/calls',
        parent: 'dashboard',
        templateUrl: 'views/pages/calls.html',
        controller: 'CallsCtrl'
    })
    .state('call-view', {
        url: '/call/{callId}/view',
        parent: 'dashboard',
        templateUrl: 'views/pages/call-view.html',
        controller: 'CallViewCtrl'
    })
    .state('recordings', {
        url: '/recordings',
        parent: 'dashboard',
        templateUrl: 'views/pages/recordings.html',
        controller: 'RecordingsCtrl'
    })
    .state('billing', {
        url: '/billing',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing.html',
        controller: 'BillingCtrl'
    })
    .state('billing-add-card', {
        url: '/billing/add-card',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing-add-card.html',
        controller: 'BillingCtrl'
    })
    .state('home', {
        url: '/home',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/home.html',
        controller: 'HomeCtrl'
    })
    .state('settings', {
        url: '/settings',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings.html',
        controller: 'SettingsCtrl'
    })
    .state('blank', {
        url: '/blank',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/blank.html',
    })
}).run(function($rootScope, SharedPref) {
      //Idle.watch();
    $rootScope.$on('IdleStart', function() { 
        /* Display modal warning or sth */ 
    });
    $rootScope.$on('IdleTimeout', function() { 
        /* Logout user */ 
        SharedPref.doLogout();
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
        // do something
        console.log("state is changing ", arguments);
        SharedPref.state = toState;
        SharedPref.showNavbar();
        /*
		Backend.get("/getBillingInfo").then(function(res) {
            SharedPref.billInfo = res.data;
        });
        */
    })
});



'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('BillingCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast, $mdDialog, $window) {
	  SharedPref.updateTitle("Billing");
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
	function toCents(dollars) {
		return dollars * 100;
	}
		function submitBilling(cardId, amount) {
			var data = {};
		data['card_id'] = cardId;
		data['amount'] =  amount;
		$scope.data.creditAmount.value;
		SharedPref.isCreateLoading =true;
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
				//SharedPref.endIsCreateLoading();
		}

		function stripeRespAddCard(response) {
			return $q(function(resolve, reject) {
				var data = {};
				data['stripe_token'] = response.id;
				data['stripe_card'] = response.card.id;
				data['last_4'] = response.card.last4;
				data['issuer'] = response.card.brand;
				SharedPref.isCreateLoading =true;
				Backend.post("/card/addCard", data).then(function(res) {
					resolve(res);
					SharedPref.endIsCreateLoading();
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
		SharedPref.isCreateLoading =true;
		Backend.post("/credit/checkoutWithPayPal", data).then(function(res) {
			var data = res.data;
			//$window.replace(data.url);
			$window.location.href = data.url;
			SharedPref.endIsCreateLoading();
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
		var recharge = $scope.settings.db.auto_recharge_top_up.value;
		data['auto_recharge_top_up'] = toCents(recharge);
		console.log("recharge in cents is ", data['auto_recharge_top_up']);
		SharedPref.isCreateLoading =true;
		Backend.post("/changeBillingSettings", data).then(function(res) {
			$mdToast.show(
			$mdToast.simple()
				.textContent('Saved billing settings')
				.position("top right")
				.hideDelay(3000)
			);
			SharedPref.endIsCreateLoading();
			});
	}

	function loadData(createLoading) {
		if (createLoading) {
			SharedPref.isCreateLoading =true;
		} else {
			SharedPref.isLoading =true;
		}
		return $q(function(resolve, reject) {
			Backend.get("/billing").then(function(res) {
				console.log("finished loading..");
				$scope.billing = res.data[0];
				$scope.settings.db = res.data[0].info.settings;
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
				$scope.cards = res.data[1];
				$scope.config = res.data[2];
				$scope.history = res.data[3];
				console.log("config is ", $scope.config);
				Stripe.setPublishableKey($scope.config.stripe.key);
				console.log("billing data is ", $scope.billing);
				console.log("cards are ", $scope.cards);
				console.log("settings are ", $scope.settings);
				$scope.creditAmount = $scope.creditAmounts[0];
				if (createLoading) {
					SharedPref.endIsCreateLoading();
				} else {
					SharedPref.endIsLoading();
				}
				resolve();
			}, reject);
		});
	}
	loadData(false);
  });

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, SharedPref) {
	  SharedPref.updateTitle("Buy Numbers");
    function DialogController($scope, $mdDialog, number) {
      $scope.number = number;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.gotoSettings = function() {
        $mdDialog.hide("");
        $state.go('my-numbers-edit', { numberId: number.id });
    }
  }
  $scope.countries = [
    {
       iso: 'CA',
       name: 'Canada'
    },
    {
       iso: 'US',
       name: 'United States'
    }
  ];
  $scope.settings = {
    country: "",
    region: "",
    pattern: "",
    rate_center: ""
  };
  $scope.numbers = [];
  $scope.didFetch = false;

  function purchaseConfirm(ev, number) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/purchase-did-confirm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "number": number
      }
    })
    .then(function() {
    }, function() {
    });
  };

  $scope.load = function() {
    SharedPref.endIsLoading();
  }
  $scope.fetch =  function(event, didForm) {
		$scope.triedSubmit = true;
		if (!didForm.$valid) {
        return;
    }
    var data = {};
    //data['region'] = $scope.settings['region'];
    data['region'] = $scope.settings['region'];
    data['rate_center'] = $scope.settings['rate_center'];
    //data['prefix'] = $scope.settings['pattern'];
    data['prefix'] = "";
    data['country_iso'] = $scope.settings['country']['iso'];
    SharedPref.isCreateLoading = true;
    Backend.get("/did/available", { "params": data }).then(function(res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
      SharedPref.endIsCreateLoading();
    });
  }
  $scope.buyNumber = function($event, number) {
        SharedPref.scrollTop();
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to purchase number "' + number.number + '"?')
          .textContent('this number will cost you ' + number.monthly_cost + ' monthly. you may unrent this number at any time ')
          .ariaLabel('Buy number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        var params = {};
        params['api_number'] = number.api_number;
        params['number'] = number.number;
        params['region'] = number.region;
        params['monthly_cost'] = number.monthly_cost;
        params['provider'] = number.provider;
        params['country'] = number.country;
        SharedPref.isCreateLoading = true;
        SharedPref.scrollTop();
        Backend.post("/did/saveNumber", params).then(function(res) {
          Backend.get("/did/numberData/" + res.headers("X-Number-ID")).then(function(res) {
              var number = res.data;
              SharedPref.endIsCreateLoading();
              purchaseConfirm($event, number);
          });
        }, function(res) {
          console.log("res is: ", res);
          if (res.status === 400) {
            var data = res.data;
            SharedPref.showError("Error", data.message);
          }
        });
    }, function() {
    });
  }
  $scope.changeCountry = function(country) {
    console.log("changeCountry ", country);
    $scope.settings.country = country;
  }

    $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CallViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, SharedPref) {
	  SharedPref.updateTitle("Call View");
  $scope.call = [];
  $scope.load = function() {
    SharedPref.isLoading =true;
    Backend.get("/call/callData/" + $stateParams['callId']).then(function(res) {
      console.log("call is ", res.data);
      SharedPref.isLoading =false;
      var call = res.data;
      call.recordings = call.recordings.map(function(obj) {
        obj['uri'] = $sce.trustAsResourceUrl(obj['uri']);
        return obj;
      });
      $scope.call = call;
    })
  }
  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('CallsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, SharedPref) {
    SharedPref.updateTitle("Calls");
    $scope.pagination = pagination;
  $scope.settings = {
    page: 0
  };
  $scope.calls = [];
  $scope.load = function() {
    SharedPref.isLoading = true;
      pagination.changeUrl( "/call/listCalls" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'calls' );
      pagination.loadData().then(function(res) {
      $scope.calls = res.data.data;
      SharedPref.endIsLoading();
    })
  }
  $scope.viewCall= function(call) {
    $state.go('call-view', {callId: call.id});
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('DashboardWelcomeCtrl', function ($scope, Backend, SharedPref, $q) {
      SharedPref.updateTitle("Dashboard");
	    $q.all([
            Backend.get("/self"),
            Backend.get("/getBillingInfo")
        ]).then(function(res) {
            SharedPref.userInfo = res[0].data;
            SharedPref.billInfo = res[1].data; 
            SharedPref.endIsLoading();
                });
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, SharedPref ) {
	  SharedPref.updateTitle("Create Extension");
  $scope.values = {
    username: "",
    secret: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.generateSecret = function() {
    $scope.values.secret = generatePassword();
  }
  $scope.showSecret = function() {
    $scope.ui.showSecret = true;
  }
  $scope.hideSecret = function() {
    $scope.ui.showSecret = false;
  }
  $scope.submit = function(form) {
    console.log("submitting extension form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['username'] = $scope.values.username;
      values['caller_id'] = $scope.values.caller_id;
      values['secret'] = $scope.values.secret;
      var toastPos = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };
      var toastPosStr = Object.keys(toastPos)
        .filter(function(pos) { return toastPos[pos]; })
        .join(' ');
      console.log("toastPosStr", toastPosStr);
      SharedPref.isCreateLoading = true;
      Backend.post("/extension/saveExtension", values).then(function() {
       console.log("updated extension..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created extension')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('extensions', {});
        SharedPref.endIsCreateLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $timeout(function() {
    SharedPref.endIsLoading();
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionEditCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $stateParams, SharedPref) {
	  SharedPref.updateTitle("Edit Extension");
  $scope.values = {
    username: "",
    secret: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.load = function() {
    SharedPref.isLoading = true;
    Backend.get("/extension/extensionData/" + $stateParams['extensionId']).then(function(res) {
      $scope.extension = res.data;
      $scope.values = angular.copy( $scope.extension );
      SharedPref.endIsLoading();
    });
  }
  $scope.generateSecret = function() {
    $scope.values.secret = generatePassword();
  }
  $scope.showSecret = function() {
    $scope.ui.showSecret = true;
  }
  $scope.hideSecret = function() {
    $scope.ui.showSecret = false;
  }
  $scope.submit = function(form) {
    console.log("submitting extension form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['username'] = $scope.values.username;
      values['secret'] = $scope.values.secret;
      values['caller_id'] = $scope.values.caller_id;
      var toastPos = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };
      var toastPosStr = Object.keys(toastPos)
        .filter(function(pos) { return toastPos[pos]; })
        .join(' ');
      console.log("toastPosStr", toastPosStr);
      SharedPref.isCreateLoading = true;
      Backend.post("/extension/updateExtension/" + $stateParams['extensionId'], values).then(function() {
       console.log("updated extension..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Updated extension')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('extensions', {});
      SharedPref.endIsCreateLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $scope.load();
});



'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ExtensionsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, SharedPref, $q) {
    SharedPref.updateTitle("Extensions");
    $scope.pagination = pagination;
    
    function DialogController($scope, $mdDialog, extension, SharedPref) {
      $scope.SharedPref = SharedPref;
      $scope.extension = extension;
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }
  $scope.settings = {
    page: 0
  };
  $scope.extensions = [];
  $scope.load = function() {
      SharedPref.isLoading = true;
      pagination.changeUrl( "/extension/listExtensions" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'extensions');
      return $q(function(resolve, reject) {
        pagination.loadData().then(function(res) {
        $scope.extensions = res.data.data;
        SharedPref.endIsLoading();
        resolve();
        }, reject);
      });
  }
  $scope.editExtension = function(extension) {
    $state.go('extension-edit', {extensionId: extension.id});
  }
  $scope.createExtension = function(extension) {
    $state.go('extension-create', {});
  }
  $scope.connectInfo = function($event, extension) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/extension-connect-info.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "extension": extension
      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.deleteExtension = function($event, extension) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this extension?')
          .textContent('This will permantely remove the extension and you will no longer be able to use it')
          .ariaLabel('Delete extension')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        SharedPref.isLoading = true;
      Backend.delete("/extension/deleteExtension/" + extension.id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Extension deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowEditorCtrl', function ($scope, Backend, $location, $state, $mdDialog, SharedPref, $stateParams, $sce) {
	  SharedPref.updateTitle("Flow Editor");
  $scope.settings = {
    page: 0
  };
  $scope.numbers = [];
  function sizeTheIframe() {
    var element = angular.element(".flow-editor-iframe");
    var windowHeight = $(window).outerHeight();
    var padding = 0;
    element.attr("height",windowHeight);
  }
  var flowUrl;
  var token = SharedPref.getAuthToken();

  if ($stateParams['flowId'] === "new" ) {
    flowUrl = SharedPref.FLOW_EDITOR_URL+"/create?auth="+token.token;
  } else {
    flowUrl = SharedPref.FLOW_EDITOR_URL + "/edit?flowId=" + $stateParams['flowId']+"&auth="+token.token;
  }
  $scope.flowUrl = $sce.trustAsResourceUrl(flowUrl);
  console.log("flow url is ", $scope.flowUrl);
  SharedPref.collapseNavbar();

  var element = angular.element(".flow-editor-iframe");
  sizeTheIframe();
  angular.element("window").on("resize.editor", function() {
    sizeTheIframe();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, SharedPref, $q) {
    SharedPref.updateTitle("Flows");
    $scope.pagination = pagination;
  $scope.settings = {
    page: 0
  };
  $scope.flows = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      SharedPref.isLoading =true;
        pagination.changeUrl( "/flow/listFlows" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'flows' );
        pagination.loadData().then(function(res) {
        $scope.flows = res.data.data;
        SharedPref.endIsLoading();
        resolve();
      }, reject);
    });
  }
  $scope.editFlow = function(flow) {
    SharedPref.changeRoute('flow-editor', {flowId: flow.id});
  }
  $scope.createFlow = function() {
    SharedPref.changeRoute('flow-editor', {flowId: "new"}); 
  }
  $scope.deleteFlow = function($event, flow) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this flow?')
          .textContent('This will permantely remove the flow and also unset the flow on numbers that have this flow attached to it')
          .ariaLabel('Delete flow')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      SharedPref.isLoading = true;
      Backend.delete("/flow/deleteFlow/" + flow.id).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Flow deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Flow deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('MyNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, SharedPref, $q) {
    SharedPref.updateTitle("My Numbers");
    $scope.pagination = pagination;
  $scope.numbers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      SharedPref.isLoading = true;
      pagination.changeUrl( "/did/listNumbers" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      SharedPref.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.buyNumber = function() {
    $state.go('buy-numbers', {});
  }
  $scope.editNumber = function(number) {
    $state.go('my-numbers-edit', {numberId: number.id});
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('If you delete this number you will not be able to call it anymore')
          .ariaLabel('Delete number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      SharedPref.isLoading = true;
      Backend.delete("/did/deleteNumber/" + number.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Number deleted..')
                .position("top right")
                .hideDelay(3000)
            );
          });

      })
    }, function() {
    });
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('MyNumbersEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, SharedPref) {
	  SharedPref.updateTitle("Edit Number");
  $scope.flows = [];
  $scope.number = null;
  $scope.saveNumber = function(number) {
    var params = {};
    params['name'] = $scope.number.name;
    params['flow_id'] = $scope.number.flow_id;
    var toastPos = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    var toastPosStr = Object.keys(toastPos)
      .filter(function(pos) { return toastPos[pos]; })
      .join(' ');
    console.log("toastPosStr", toastPosStr);
      SharedPref.isCreateLoading = true;
    Backend.post("/did/updateNumber/" + $stateParams['numberId'], params).then(function() {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Number updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('my-numbers', {});
      SharedPref.endIsCreateLoading();
    });
  }
  $scope.changeFlow = function(flow) {
    $scope.number.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  SharedPref.isLoading = true;
  $q.all([
    Backend.get("/flow/listFlows"),
    Backend.get("/did/numberData/" + $stateParams['numberId'])
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $scope.number = res[1].data;
    SharedPref.endIsLoading();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('RecordingsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $sce, SharedPref, $q, $mdToast) {
	  SharedPref.updateTitle("Recordings");
  $scope.settings = {
    page: 0
  };
  $scope.pagination = pagination;
  $scope.recordings = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      SharedPref.isLoading = true;
        pagination.changeUrl( "/recording/listRecordings" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'recordings' );
        pagination.loadData().then(function(res) {
        var recordings = res.data.data;
        $scope.recordings = recordings.map(function(obj) {
          obj.uri = $sce.trustAsResourceUrl(obj.uri);
          return obj;
        });
        SharedPref.endIsLoading();
        resolve();
      }, reject)
    });
  }
  $scope.deleteRecording = function($event, recording) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this recording?')
          .textContent('This will permantely remove the recordings from your storage')
          .ariaLabel('Delete recording')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      SharedPref.isLoading = true;
      Backend.delete("/recording/deleteRecording/" + recording.id).then(function() {
        console.log("deleted recording..");
        $scope.load().then(function() {
          $mdToast.show(
            $mdToast.simple()
              .textContent('recording deleted..')
              .position('top right')
              .hideDelay(3000)
          );
        })
      });
    }, function() {
    });
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('cardCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.options1 = {
	    lineWidth: 12,
	    scaleColor: false,
	    size: 120,
	    lineCap: "square",
	    barColor: "#fb8c00",
	    trackColor: "#f9dcb8"
	};
	

}]);
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ChartCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.line = {
	    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	          data: [
	      [65, 59, 80, 81, 56, 55, 40],
	      [28, 48, 40, 19, 86, 27, 90]
	    ],
	    colours: ['#2979FF','#00D554','#7AB67B','#D9534F','#3faae3'],
	    onClick: function (points, evt) {
	      console.log(points, evt);
	    }

    };

    $scope.bar = {
	    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
		data: [
		   [65, 59, 80, 81, 56, 55, 40],
		   [28, 48, 40, 19, 86, 27, 90]
		],
		colours: ['#FFA726','#FF4081','#7AB67B','#D9534F','#3faae3']
    	
    };

    $scope.donut = {
    	labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	      data: [300, 500, 100],
    	      colours: ['#FF4081','#F0AD4E','#00D554','#D9534F','#3faae3']
    };

     $scope.pie = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	      data : [300, 500, 100],
    	      colours: ['#FF4081','#F0AD4E','#00D554','#D9534F','#3faae3']
    };


    $scope.datapoints=[{"x":10,"top-1":10,"top-2":15},
                       {"x":20,"top-1":100,"top-2":35},
                       {"x":30,"top-1":15,"top-2":75},
                       {"x":40,"top-1":50,"top-2":45}];
    $scope.datacolumns=[{"id":"top-1","type":"spline"},
                        {"id":"top-2","type":"spline"}];
    $scope.datax={"id":"x"};

    
}]);
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular
    .module('MaterialApp')
    .controller('calendarCtrl', function ($scope) {
    });
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('componentCtrl', function ($scope, $interval, $mdToast, $document) {
    $scope.rating1 = 3;
    $scope.rating2 = 2;
    $scope.rating3 = 4;  
    var self = this,  j= 0, counter = 0;
    self.modes = [ ];
    self.activated = true;
    self.determinateValue = 30;
    /**
    * Turn off or on the 5 themed loaders
    */
    self.toggleActivation = function() {
        if ( !self.activated ) self.modes = [ ];
        if (  self.activated ) j = counter = 0;
    };
    // Iterate every 100ms, non-stop
    $interval(function() {
    // Increment the Determinate loader
        self.determinateValue += 1;
        if (self.determinateValue > 100) {
            self.determinateValue = 30;
        }
        // Incrementally start animation the five (5) Indeterminate,
        // themed progress circular bars
        if ( (j < 5) && !self.modes[j] && self.activated ) {
            self.modes[j] = 'indeterminate';
        }
        if ( counter++ % 4 == 0 ) j++;
    }, 100, 0, true);
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.demo = {};
    $scope.toastPosition = angular.extend({},last);
    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };
    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    $scope.showCustomToast = function() {
        $mdToast.show(
            $mdToast.simple()
            .content('Simple Toast!')
            .position($scope.getToastPosition())
            .hideDelay(30000)
            );
    };
    $scope.showSimpleToast = function() {
        $mdToast.show(
            $mdToast.simple()
            .content('Simple Toast!')
            .position($scope.getToastPosition())
            .hideDelay(30000)
            );
    };
    $scope.showActionToast = function() {
        var toast = $mdToast.simple()
        .content('Action Toast!')
        .action('OK')
        .highlightAction(false)
        .position($scope.getToastPosition());
        $mdToast.show(toast).then(function(response) {
            if ( response == 'ok' ) {
                alert('You clicked \'OK\'.');
            }
        });
    };
})
.controller('ToastCtrl', function($scope, $mdToast) {
    $scope.closeToast = function() {
        $mdToast.hide();
    };

});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('DashboardCtrl', function($scope, $state, $rootScope, $translate, $timeout, $window, SharedPref) {
	$scope.SharedPref = SharedPref;
  	if ($(window).width()<1450) {
        $( '.c-hamburger' ).removeClass('is-active');
        $('body').removeClass('extended');
    }

  	$scope.$state = $state;

  	$rootScope.$on('$stateChangeSuccess', function(){ 
		$timeout(function() {
			$('body').scrollTop(0);
		}, 200);
	});

  	if ($('body').hasClass('extended')) {
	  	$timeout(function(){
			$('.sidebar').perfectScrollbar();
		}, 200);		
  	};

  	$scope.rtl = function(){
  		$('body').toggleClass('rtl');
  	}
  	$scope.subnav = function(x){
		if(x==$scope.showingSubNav)
			$scope.showingSubNav = 0;			
		else
			$scope.showingSubNav = x;
		return false;
	}
	$scope.extend = function  () {
		$( '.c-hamburger' ).toggleClass('is-active');
        $('body').toggleClass('extended');
        $('.sidebar').toggleClass('ps-container');	
        $rootScope.$broadcast('resize');
        $timeout(function(){
			$('.sidebar').perfectScrollbar();
			console.log('pfscroll');
		}, 200);	
	}	
	
	

	$scope.changeTheme = function(setTheme){

		$('<link>')
		  .appendTo('head')
		  .attr({type : 'text/css', rel : 'stylesheet'})
		  .attr('href', 'styles/app-'+setTheme+'.css');
	}
	
	var w = angular.element($window);
  
	w.bind('resize', function () {
		/*
	    if ($(window).width()<1200) {
            $('.c-hamburger').removeClass('is-active');
            $('body').removeClass('extended');
        } 
        if ($(window).width()>1600) {
            $('.c-hamburger').addClass('is-active');
            //$('body').addClass('extended');          
		};
		*/
	});   

	if ($(window).width()<1200) {		
		$rootScope.$on('$stateChangeSuccess', function(){ 
			$( '.c-hamburger' ).removeClass('is-active');
        	$('body').removeClass('extended');
		});
	}

	if ($(window).width()<600) {		
		$rootScope.$on('$stateChangeSuccess', function(){ 
			$( '.mdl-grid' ).removeAttr('dragula');
		});
	}
	
	$scope.changeLanguage = (function (l) {
		
		$translate.use(l);			
		
	});
	
});	

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('ForgotCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast, Idle) {
	  SharedPref.updateTitle("Forgot Password");
	$scope.triedSubmit = false;
	$scope.isLoading = false;
	$scope.user = {
		email: "",
	};
    $scope.submit = function($event, forgotForm) {
		$scope.triedSubmit = true;
		if (forgotForm.$valid) {
			var data = angular.copy( $scope.user );
			$scope.isLoading = true;
			Backend.post("/forgot", data).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Reset instructions sent to email..')
						.position("top right")
						.hideDelay(3000)
					);
			}).catch(function() {
				$scope.isLoading = false;
			})
			return;
		}
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('HeadCtrl', function ($scope, SharedPref) {
  $scope.SharedPref = SharedPref;
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('HomeCtrl', ['$scope', '$timeout', 'Backend', 'SharedPref', '$q', function ($scope, $timeout, Backend, SharedPref, $q) {
	  SharedPref.updateTitle("Dashboard");
	$scope.options1 = {
	    lineWidth: 8,
	    scaleColor: false,
	    size: 85,
	    lineCap: "square",
	    barColor: "#fb8c00",
	    trackColor: "#f9dcb8"
	};
	$scope.options2 = {
	    lineWidth: 8,
        scaleColor: false,
        size: 85,
        lineCap: "square",
        barColor: "#00D554",
        trackColor: "#c7f9db"
	};
	$scope.options3 = {
	    lineWidth: 8,
        scaleColor: false,
        size: 85,
        lineCap: "square",
        barColor: "#F800FC",
        trackColor: "#F5E5F5"
	};

	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];

	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	if ($(window).width()<600) {		
		$( '.mdl-grid' ).removeAttr('dragula');
	};
    $scope.line2 = {
	    labels: ["JAN","FEB","MAR","APR","MAY","JUN"],
	          data: [
	      			[99, 180, 80, 140, 120, 220, 100],
	      			[50, 145, 200, 75, 50, 100, 50]
		],
	    colours: [{ 
				fillColor: "#2b36ff",
	            strokeColor: "#C172FF",
	            pointColor: "#fff",
	            pointStrokeColor: "#8F00FF",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "#8F00FF"
        	},
        	{
        		fillColor: "#ffa01c",
	            strokeColor: "#FFB53A",
	            pointColor: "#fff",
	            pointStrokeColor: "#FF8300",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "#FF8300"
        	}
        	],
	    options: {
	    	responsive: true,
            bezierCurve : false,
            datasetStroke: false,
            legendTemplate: false,
            pointDotRadius : 9,
            pointDotStrokeWidth : 3,
            datasetStrokeWidth : 3
	    },
	    onClick: function (points, evt) {
	      console.log(points, evt);
	    }

	};
	$scope.load = function() {
		$timeout(function () {
			var color = Chart.helpers.color;
			SharedPref.isLoading = true;
			Backend.get("/dashboard").then(function(res) {
				var graph = res.data[0];
				SharedPref.billInfo=  res.data[1];
				SharedPref.userInfo=  res.data[2];
				console.log("graph data is ", graph);
				SharedPref.isLoading = false;
				$timeout(function(){
					$scope.line = {
						legend: true,
						labels: graph.labels,
							data: [
						graph.data.inbound,
						graph.data.outbound
						//[7, 20, 10, 15, 17, 10, 27],
						//[6, 9, 22, 11, 13, 20, 27]
						],
						series: [
					'Inbound',
					'Outbound'
				],
						colours: [{ 
								fillColor: "#3f51b5",
								strokeColor: "#3f51b5",
								pointColor: "#3f51b5",
								pointStrokeColor: "#3f51b5",
								pointHighlightFill: "#3f51b5",
								pointHighlightStroke: "#3f51b5"
							},
							{
								fillColor: "#3D3D3D",
								strokeColor: "#3D3D3D",
								pointColor: "#3D3D3D",
								pointStrokeColor: "#3D3D3D",
								pointHighlightFill: "#3D3D3D",
								pointHighlightStroke: "#3D3D3D"
							}
							],
		options: {
				legend: {
			display: true,
			position: 'right'
			},
							responsive: true,
								bezierCurve : false,
								datasetStroke: false,
								/*
								legendTemplate: '<ul>'
						+'<% for (var i=0; i<datasets.length; i++) { %>'
							+'<li style=\"background-color:<%=datasets[i].fillColor%>\">'
							+'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
						+'</li>'
						+'<% } %>'
					+'</ul>',
					*/
								pointDotRadius : 6,
								showTooltips: false,
						},
						onClick: function (points, evt) {
						console.log(points, evt);
						}

					};
				}, 0);
			});
		}, 0);
	}
	$scope.reloadGraph = function() {
		console.log("reloadGraph called..");
		$scope.load();
	}
	$scope.load();

}]);
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('LoginCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, Idle) {
	  SharedPref.updateTitle("Login");
	$scope.triedSubmit = false;
	$scope.couldNotLogin = false;
	$scope.shouldSplash = false;
	$scope.isLoading = false;
	$scope.user = {
		email: "",
		password: ""
	};
    $scope.submit = function($event, loginForm) {
		$scope.triedSubmit = true;
		if (loginForm.$valid) {
			var data = angular.copy( $scope.user );
			$scope.isLoading = true;
			Backend.post("/jwt/authenticate", data).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				SharedPref.setAuthToken( token );
				Idle.watch();
		        $state.go('home', {});
			}).catch(function() {
				$scope.isLoading = false;
				$scope.couldNotLogin = true;
			})
			return;
		}
    }

    $scope.authenticate = function() {

    	var defer = $q.defer();

    	$timeout(function(){

    		defer.resolve();

    		$timeout(function(){
				Idle.watch();
    		   	$location.path('/dashboard/home');
    		}, 600);

    	}, 1100);

    	return defer.promise;

    }

  });

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

angular.module('MaterialApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PaginationDemoCtrl', function ($scope, $log) {
  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('paperCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
	$scope.status = '  ';

	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	    	controller: DialogController,
	      	templateUrl: 'views/pages/dashboard/mail/compose.html',
	      	parent: angular.element(document.body),
	      	targetEvent: ev,
	      	clickOutsideToClose:true
	    });
	};
	function DialogController($scope, $mdDialog) {
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	}
	
	$scope.cards = [
		{
			name: 'Gary Neville',
			subject: 'Once a scouse, always a scouse.',
			body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			time: '30 minutes ago'	
		},
		{
			name: 'Antony Martial',
			subject: 'Meet up in LA.',
			body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			time: '30 minutes ago'	
		},
		{
			name: 'Danny Ings',
			subject: 'Request for loan.',
			body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			time: '30 minutes ago'	
		},
		{
			name: 'Roberto Firmoni',
			subject: 'No match time!',
			body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			time: '30 minutes ago'	
		},
		{
			name: 'Lewandowski',
			subject: 'Watch that?',
			body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			time: '30 minutes ago'	
		},
		{
			name: 'Pep Guardiola',
			subject: 'When is BR Leaving?',
			body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			time: '30 minutes ago'	
		}
	];


}]);
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('piechartCtrl', ['$scope', function ($scope) {
   
    $scope.options1 = {
        animate:{
            duration:2000,
            enabled:true
        },
        barColor:'#F0AD4E',
        trackColor:'#ECF0F1',
        scaleColor:'#737373',

        lineWidth:5,
        size: 115,
        lineCap:'circle'
    };
    $scope.options2 = {
        animate:{
            duration:2000,
            enabled:true
        },
        barColor:'#3CA2E0',
        trackColor:'#ECF0F1',
        scaleColor:'#737373',

        lineWidth:5,
        size: 115,
        lineCap:'circle'
    };
    $scope.options3 = {
        animate:{
            duration:2000,
            enabled:true
        },
        barColor:'#D9534F',
        trackColor:'#ECF0F1',
        scaleColor:'#737373',

        lineWidth:5,
        size: 115,
        lineCap:'circle'
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('profileCtrl', function ($scope) {
    $scope.products = [
 	{url:'images/portrait1.jpg'}, 
 	{url:'images/portrait2.jpg'},         
 	{url:'images/portrait3.jpg'},         
 	{url: 'images/portrait4.jpg'},
 	{url: 'images/portrait5.jpg'},
 	{url: 'images/portrait7.jpg'},
 	{url: 'images/portrait8.jpg'},
 	{url: 'images/portrait9.jpg'}
 	];
   
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('ProgressDemoCtrl', function ($scope) {
  $scope.max = 200;

  $scope.random = function() {
    var value = Math.floor((Math.random() * 100) + 1);
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');

    $scope.dynamic = value;
    $scope.type = type;
  };
  $scope.random();

  $scope.randomStacked = function() {
    $scope.stacked = [];
    var types = ['success', 'info', 'warning', 'danger'];

    for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
        var index = Math.floor((Math.random() * 4));
        $scope.stacked.push({
          value: Math.floor((Math.random() * 30) + 1),
          type: types[index]
        });
    }
  };
  $scope.randomStacked();
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('RegisterCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast, Idle) {
	  SharedPref.updateTitle("Register");

	  var countryToCode = {
		  US: "+1",
		  CA: "+1",
	  };
	  $scope.triedSubmit = false;
	  $scope.passwordsDontMatch = false;
	  $scope.shouldSplash = false;
	  $scope.didVerifyCall = false;
	  $scope.step = 1;
	  $scope.userId = null;
	  $scope.token = null;
	  $scope.invalidCode =false; 
	  $scope.invalidNumber =false; 
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

  function doSpinup() {
	$scope.shouldSplash = true;
	SharedPref.setAuthToken( $scope.token );
	var data = { "userId": $scope.userId };
	$scope.invalidCode = false;
	Backend.post("/userSpinup", data).then(function( res ) {
		var data = res.data;
		if ( data.success ) {
			Idle.watch();
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
		if ($scope.user.password !== $scope.user.password2) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (registerForm.$valid) {
			var data = angular.copy( $scope.user );
			Backend.post("/register", data).then(function( res ) {
				$scope.token = res.data.token;
				$scope.userId = res.data.userId;
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
			Backend.post("/registerSendVerify", data).then(function( res ) {
				var data = res.data;
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
			Backend.post("/registerVerify", data).then(function( res ) {
				var isValid = res.data.isValid;
				if (isValid) {
					$scope.step = 3;
				} else {
					$scope.invalidCode = true;
				}
			});
			return;
		}
		return false;
	}

	$scope.submitWorkspaceForm = function($event, workspaceForm) {
		console.log("called submitWorkspaceForm");
		$scope.triedSubmit = true;
		if (workspaceForm.$valid) {
			var data = {};
			data["userId"] = $scope.userId;
			data.workspace = $scope.workspace;
			Backend.post("/updateWorkspace", data).then(function( res ) {
				if (res.data.success) {
					$scope.invalidWorkspaceTaken = false;
					doSpinup();
					return;
				}
				$scope.invalidWorkspaceTaken = true;
			});
		}
		return false;
	}


	$scope.recall = function() {
		var data = angular.copy( $scope.verify1 );
		data.userId = $scope.userId;
		Backend.post("/registerSendVerify", data).then(function( res ) {
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

  });

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('ResetCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast, Idle) {
	  SharedPref.updateTitle("Reset");
	$scope.triedSubmit = false;
	$scope.isLoading = false;
	$scope.couldNotReset = false;
	$scope.couldNotResetMsg = "";
	var token = $location.search()['token'];
	$scope.user = {
		email: "",
		password: "",
		confirmPassword: "",
		token: token
	};
	console.log("reset params are ", $scope.user);
    $scope.submit = function($event, resetForm) {
		$scope.triedSubmit = true;
		if ($scope.user.password !== $scope.user.confirmPassword) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (resetForm.$valid) {
			var data = {};
			data.email = $scope.user.email;
			data.token = $scope.user.token;
			data.password = $scope.user.password;
			data.password_confirmation = $scope.user.confirmPassword;
			$scope.isLoading = true;
			console.log("requesting reset ", data);
			$scope.couldNotReset = false;
			$scope.couldNotResetMsg = "";
			Backend.post("/reset", data, true).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Password was reset successfully.')
						.position("top right")
						.hideDelay(3000)
					);
			
		        $state.go('login', {});
			}).catch(function(res) {
				console.log("error reply is ", res);
				$scope.couldNotReset = true;
				$scope.couldNotResetMsg = res.data.message;

				$scope.isLoading = false;
			})
			return;
		}
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('SettingsCtrl', function($scope, $location, $timeout, $q, Backend, SharedPref, $state, $mdToast) {
	  SharedPref.updateTitle("Settings");
	  $scope.triedSubmit = false;
	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: ""
	};
    $scope.submitSettings = function($event, settingsForm) {
		$scope.triedSubmit = true;
		if (settingsForm.$valid) {
			var data = {};
			data['first_name'] = $scope.user.first_name;
			data['last_name'] = $scope.user.last_name;
			data['email'] = $scope.user.email;
			SharedPref.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your info')
						.position("top right")
						.hideDelay(3000)
					);
					SharedPref.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}
    $scope.submitPasswords = function($event, passwordsForm) {
		$scope.triedSubmit = true;
		if ($scope.user.password !== $scope.user.password2) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (passwordsForm.$valid) {
			var data = {};
			data['password'] = $scope.user.password;
			SharedPref.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
				var token = res.data;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your passwords')
						.position("top right")
						.hideDelay(3000)
					);
				SharedPref.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}
	SharedPref.isLoading = true;
	Backend.get("/self").then(function(res) {
		$scope.user = res.data;
		console.log("user is ", $scope.user);
		SharedPref.endIsLoading();
	});
  });

'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('sidenavCtrl', function($scope, $location){
	$scope.selectedMenu = 'dashboard';
	$scope.collapseVar = 0;

	$scope.check = function(x){

		if(x==$scope.collapseVar)
			$scope.collapseVar = 0;
		else
			$scope.collapseVar = x;
	};
	$scope.multiCheck = function(y){

		if(y==$scope.multiCollapseVar)
			$scope.multiCollapseVar = 0;
		else
			$scope.multiCollapseVar = y;
	};
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('TabsDemoCtrl', function ($scope, $window) {
  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('TimepickerDemoCtrl', function ($scope, $log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
 angular.module('MaterialApp').controller('todoCtrl', function ($scope) {
 	$scope.todos = [
 	{text:'Meeting with Nabindar Singh.', done:false, id: 'option1'}, 
 	{text:'Exercise at 6:pm with Nicholas.', done:false, id: 'option3'},         
 	{text:'Avengers Age of Ultron.', done:false, id: 'option4'},         
 	{text: 'Henna birthday at Mezbaan.', done:false, id: 'option5'}
 	];
 	function makeid()
 	{
 		var text = "";
 		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 		for( var i=0; i < 5; i++ )
 			text += possible.charAt(Math.floor(Math.random() * possible.length));

 		return text;
 	}
 	$scope.addTodo = function () {
 		$scope.todos.push({text:$scope.formTodoText, done:false, id:makeid()});
 		$scope.formTodoText = '';
 	};
 });
'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('TooltipDemoCtrl', function ($scope) {
  $scope.dynamicTooltip = 'Hello, World!';
  $scope.dynamicTooltipText = 'dynamic';
  $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
});