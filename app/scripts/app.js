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
    .factory("SharedPref", function($state, $mdDialog, $timeout, $q) {
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
      if (!except.includes(route)) {
        factory.isLoading = true;
      }
      $state.go(route, params)
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
        factory.delete = function(path)
        {
            return $q(function(resolve, reject) {
                $http.delete(createUrl(path), params).then(resolve,function(err) {
                    errorHandler();
                    reject(err);
                 });
            });

        }
        factory.post = function(path, params)
        {
            return $q(function(resolve, reject) {
                $http.post(createUrl(path), params).then(resolve,function(err) {
                    errorHandler();
                    reject(err);
                 });
            });

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
        templateUrl: 'views/base.html?v='+window.app_version,
        controller: 'DashboardCtrl'
    })
    .state('login', {
        url: '/login',
        parent: 'base',
        templateUrl: 'views/pages/login.html?v='+window.app_version,
        controller: 'LoginCtrl'
    })
    .state('register', {
        url: '/register',
        parent: 'base',
        templateUrl: 'views/pages/register.html?v='+window.app_version,
        controller: 'RegisterCtrl'
    })
    .state('404', {
        url: '/404-page',
        parent: 'base',
        templateUrl: 'views/pages/404-page.html?v='+window.app_version
    })
    .state('dashboard', {
        url: '/dashboard',
        parent: 'base',
        templateUrl: 'views/layouts/dashboard.html?v='+window.app_version,
        controller: 'DashboardCtrl'
    })
    .state('dashboard-user-welcome', {
        url: '/dashboard/welcome',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard-welcome.html?v='+window.app_version,
        controller: 'DashboardWelcomeCtrl'
    })
    .state('my-numbers', {
        url: '/dids/my-numbers',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/my-numbers.html?v='+window.app_version,
        controller: 'MyNumbersCtrl'
    })
    .state('my-numbers-edit', {
        url: '/dids/my-numbers/{numberId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/my-numbers-edit.html?v='+window.app_version,
        controller: 'MyNumbersEditCtrl'
    })
    .state('buy-numbers', {
        url: '/dids/buy-numbers',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/buy-numbers.html?v='+window.app_version,
        controller: 'BuyNumbersCtrl'
    })
    .state('flows', {
        url: '/flows',
        parent: 'dashboard',
        templateUrl: 'views/pages/flows.html?v='+window.app_version,
        controller: 'FlowsCtrl'
    })
    .state('flow-editor', {
        url: '/flows/{flowId}',
        parent: 'dashboard',
        templateUrl: 'views/pages/flow-editor.html?v='+window.app_version,
        controller: 'FlowEditorCtrl'
    })
    .state('extensions', {
        url: '/extensions',
        parent: 'dashboard',
        templateUrl: 'views/pages/extensions.html?v='+window.app_version,
        controller: 'ExtensionsCtrl'
    })
    .state('extension-create', {
        url: '/extension/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/extension-create.html?v='+window.app_version,
        controller: 'ExtensionCreateCtrl'
    })
    .state('extension-edit', {
        url: '/extension/{extensionId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/extension-edit.html?v='+window.app_version,
        controller: 'ExtensionEditCtrl'
    })
    .state('calls', {
        url: '/calls',
        parent: 'dashboard',
        templateUrl: 'views/pages/calls.html?v='+window.app_version,
        controller: 'CallsCtrl'
    })
    .state('call-view', {
        url: '/call/{callId}/view',
        parent: 'dashboard',
        templateUrl: 'views/pages/call-view.html?v='+window.app_version,
        controller: 'CallViewCtrl'
    })
    .state('recordings', {
        url: '/recordings',
        parent: 'dashboard',
        templateUrl: 'views/pages/recordings.html?v='+window.app_version,
        controller: 'RecordingsCtrl'
    })
    .state('billing', {
        url: '/billing',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing.html?v='+window.app_version,
        controller: 'BillingCtrl'
    })
    .state('billing-add-card', {
        url: '/billing/add-card',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing-add-card.html?v='+window.app_version,
        controller: 'BillingCtrl'
    })
    .state('home', {
        url: '/home',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/home.html?v='+window.app_version,
        controller: 'HomeCtrl'
    })
    .state('settings', {
        url: '/settings',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings.html?v='+window.app_version,
        controller: 'SettingsCtrl'
    })
    .state('blank', {
        url: '/blank',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/blank.html?v='+window.app_version
    })
    .state('profile', {
        url: '/profile',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/profile.html?v='+window.app_version,
        controller: 'profileCtrl'
    })
    .state('form', {
        url: '/form',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/form.html?v='+window.app_version,
        controller: 'formCtrl'
    }) 

    .state('button', {
        url: '/ui-elements/button',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/ui-elements/button.html?v='+window.app_version
    }) 
    .state('card', {
        url: '/ui-elements/card',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/ui-elements/card.html?v='+window.app_version,
        controller: 'cardCtrl'
    })
    .state('components', {
        url: '/ui-elements/components',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/component.html?v='+window.app_version,
        controller: 'componentCtrl'
    })
    .state('chartjs', {
        url: '/charts/chart.js',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/charts/chartjs.html?v='+window.app_version,
        controller: 'ChartCtrl'
    })  
    .state('c3chart', {
        url: '/charts/c3chart',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/charts/c3chart.html?v='+window.app_version
    })      
    .state('calendar', {
        url: '/calendar',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/calendar.html?v='+window.app_version,
        controller: 'calendarCtrl'
    })
    .state('invoice', {
        url: '/invoice',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/invoice.html?v='+window.app_version
    })
    .state('inbox', {
        url: '/mail/inbox',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/mail/inbox.html?v='+window.app_version,
        controller: 'paperCtrl'
    })
    .state('docs', {
        url: '/docs',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/docs.html?v='+window.app_version,
        controller: 'docsCtrl'
    });
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
        SharedPref.showNavbar();
        /*
		Backend.get("/getBillingInfo").then(function(res) {
            SharedPref.billInfo = res.data;
        });
        */
    })
});


