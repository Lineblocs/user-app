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
    'gridshore.c3js.chart',
    'angular-growl',
    'growlNotifications',    
    'angular-loading-bar',
    'easypiechart',
    'ui.sortable',
    angularDragula(angular),
    'bootstrapLightbox',
    'materialCalendar',
    'paperCollapse',
    'pascalprecht.translate',
    'md.data.table'
    ])
    .service('JWTHttpInterceptor', function() {
        return {
            // optional method
            'request': function(config) {
                // do something on success
                var token = localStorage.getItem("AUTH");
                if (token) {
                    try {
                        var tokenObj = JSON.parse( token );
                        if (checkExpires()) {
                            getNewToken();
                        } else {
                            config.headers['Authorization'] = "Bearer " + tokenObj.token;
                        }
                    } catch (e) {
                        console.error("error parsing token ", token);
                    }
                }
                console.log("request headers are ", config.headers);
                return config;
            }
        };
    })
    .factory("SharedPref", function($state, Backend) {
        var factory = this;
        var baseTitle = "LineBlocs.com";
        factory.title = baseTitle;
        factory.FLOW_EDITOR_URL = "http://45.76.62.46:8091";
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
        factory.updateTitle = function(text) {
            factory.title = baseTitle;
            if (text) {
                   factory.title = baseTitle + " - " + text;
            }
        }
        return factory;
    })
    .factory("Backend", function($http, $q) {
        var factory = this;
        var baseUrl = "http://45.76.62.46:8090/api";
        function createUrl(path) {
            return baseUrl + path;
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
            return $http.get(createUrl(path), params);
        }
        factory.delete = function(path)
        {
            return $http.delete(createUrl(path));
        }
        factory.post = function(path, params)
        {
            return $http.post(createUrl(path), params);
        }
        return factory;
    })
    .config(['cfpLoadingBarProvider', '$httpProvider', function(cfpLoadingBarProvider, $httpProvider) {
        cfpLoadingBarProvider.latencyThreshold = 5;
          cfpLoadingBarProvider.includeSpinner = false;
          cfpLoadingBarProvider.includeBar = false;
          //cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
          //cfpLoadingBarProvider.spinnerTemplate = '<md-progress-circular md-mode="indeterminate"></md-progress-circular>';
          $httpProvider.interceptors.push('JWTHttpInterceptor');

    }])
       
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


