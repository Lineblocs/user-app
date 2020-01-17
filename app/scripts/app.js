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
function getJWTTokenObj() {
    var token = localStorage.getItem("AUTH");
    if (token) {
            var parsed = JSON.parse(token);
            return parsed;
    }
    return "";
}

function getJWTToken() {
    var parsed = getJWTTokenObj();
    if (parsed !== "") {
            return "Bearer " + parsed.token;
    }
    return "";
}
function getWorkspaceID() {
    var parsed = JSON.parse(localStorage.getItem("WORKSPACE"));
    return parsed.id;
}
var check1 = document.location.href.includes("http://localhost");
var check2 = document.location.href.includes("ngrok.io");
if (check1 || check2) {
    var baseUrl = "https://lineblocs.com/api";
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
function formatDate(input, addTime) {
    var format = 'YYYY-MM-DD';
    addTime = addTime || false;
    if (addTime) {
        format += ' HH:mm:ss';
    }
    return input ? moment(input).format(format) : '';
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
                var workspace = localStorage.getItem("WORKSPACE");
                if (workspace) {
                    config.headers['X-Workspace-ID'] = getWorkspaceID();
                }

                console.log("request headers are ", config.headers);
                return config;
            }
        };
    })
    .factory("SharedPref", function($state, $mdDialog, $timeout, $q, $window, $location, $mdToast) {
        var factory = this;
        var baseTitle = "LineBlocs.com";
        factory.title = baseTitle;
        factory.FLOW_EDITOR_URL = "https://editor.lineblocs.com";
        factory.SHOW_NAVBAR = true;
        factory.PAGE_CONTENT_NO_PADDING = false; 
        factory.isLoading = true;
        factory.currentWorkspace = "";
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

        factory.billingPackages = ['gold', 'silver', 'bronze'];
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
        factory.processResult = function() {
            var params = $location.search();
            if (params['result'] && params['result'] === 'email-verified') {
                    $mdToast.show(
                    $mdToast.simple()
                        .textContent('Email was verified')
                        .position("top right")
                        .hideDelay(3000)
                    );
            }
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
        factory.setWorkspace= function(workspace) {
            localStorage.setItem("WORKSPACE", JSON.stringify(workspace));
        }
        factory.getWorkspace =  function(workspace) {
            return JSON.parse(localStorage.getItem("WORKSPACE"));
        }

        factory.canPerformAction = function(action) {
            var workspace = factory.getWorkspace();
            if (workspace.user_info[action]) {
                return true;
            }
            return false;
        }
        factory.has = function() {
            return JSON.parse(localStorage.getItem("WORKSPACE"));
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
        factory.makeDefaultWorkspaceRoles = function(addInfo) {
            if (!addInfo) {
                return {
      'manage_users' : false,
      'manage_extensions' : false,
      'create_extension' : false,
      'manage_billing' : false,
      'manage_workspace' : false,
      'manage_dids' : false,
      'create_did' : false,
      'manage_calls' : false,
      'manage_recordings' : false,
      'manage_blocked_numbers' : false,
      'manage_ip_whitelist' : false,
      'manage_verified_caller_ids' : false,
      'create_flow' : false,
      'manage_flows' : false
            };
            }
            var info = [];
            info.push({
                "id": "manage_users",
                "name": "Manage Users",
                "info": "Allow this user to create, read, update or delete other users in your workspace"
            });
            info.push({
                "id": "manage_extensions",
                "name": "Manage Extensions", 
                "info": "Allow this user to create, read, update or delete other extensions in your workspace"
            });
            info.push({
                "id": "create_extension",
                "name": "Create Extension", 
                "info": "Allow this user to create an extension"
            });
             info.push({
                "id": "manage_billing",
                "name": "Manage Billing",
                "info": "Allow this user to manage used credit cards, payment options, usage limits and advanced billing settings"
            });
             info.push({
                "id": "manage_workspace",
                "name": "Manage Workspace",
                "info": "Allow this user to manage workspace settings"
            });
            info.push({
                "id": "manage_dids",
                "name": "Manage DIDs",
                "info": "Allow this user to buy and manage DIDs"
            });
            info.push({
                "id": "create_did",
                "name": "Create DID",
                "info": "Allow this user to buy a DID"
            });
            info.push({
                "id": "manage_calls",
                "name": "Manage Calls",
                "info": "Allow this user to manage calls"
            });
            info.push({
                "id": "manage_recordings",
                "name": "Manage Recordings",
                "info": "Allow this user to manage recordings"
            });
            info.push({
                "id": "manage_blocked_numbers",
                "name": "Manage Blocked Numbers",
                "info": "Allow this user to manage blocked numbers"
            });
            info.push({
                "id": "manage_ip_whitelist",
                "name": "Manage IP Whitelist",
                "info": "Allow this user to manage IP whitelist"
            });
            info.push({
                "id": "manage_verified_caller_ids",
                "name": "Manage Verified Caller IDs",
                "info": "Allow this user to manage verified caller ids"
            });
            info.push({
                "id": "manage_flows",
                "name": "Manage Flows",
                "info": "Allow this user to manage flows"
            });
            info.push({
                "id": "create_flow",
                "name": "Create Flow",
                "info": "Allow this user to create flows"
            });












            return info;
        }
        return factory;
    })
    .factory("Backend", function($http, $q, SharedPref) {
        var factory = this;
        function errorHandler(error, showMsg) {
            console.log("erroHandler ", arguments);
            if ( showMsg ) {
                    error = error || "An error occured.";
                    SharedPref.showError(error);
                    return;
            }
            SharedPref.showError("An error occured.");

        }
        factory.getJWTToken = function(email, password) {
            var params = {
                email: email,
                password: password
            };
            return $q(function(resolve, reject) {
                $http.post( createUrl( "/jwt/authenticate"), params).then( function(res) {
                    localStorage.setItem("AUTH", JSON.stringify(res.data.jwt));
                    localStorage.setItem("WORKSPACE", JSON.stringify(res.data.workspace));
                    resolve();
                }).catch(function(err) {
                    reject( err );
                });
            });
        }
        factory.get = function(path, params, showMsg)
        {
            return $q(function(resolve, reject) {
                $http.get(createUrl(path), params).then(resolve,function(err) {
                    var message = err.message;
                    errorHandler(message, showMsg);
                    reject(err);
                 });
            });
        }
        factory.getPagination = function(path, params)
        {
            path = path + "?page=" + pagination.settings.currentPage;
            return factory.get(path, params);
        }

        factory.delete = function(path, showMsg)
        {
            return $q(function(resolve, reject) {
                $http.delete(createUrl(path)).then(resolve,function(err) {
                    var message = err.message;
                    errorHandler(message, showMsg);

                    reject(err);
                 });
            });

        }
        factory.post = function(path, params, suppressErrDialog, showMsg)
        {
            return $q(function(resolve, reject) {
                $http.post(createUrl(path), params).then(resolve,function(err) {
                    var message = err.message;
                    if (!suppressErrDialog) {
                        errorHandler(message, showMsg);
                    }
                    reject(err);
                 });
            });

        }
        factory.postFiles =  function(url, data, showMsg) {
            return $q(function(resolve, reject) {
                $http({

                    url: createUrl(url),
                    method: "POST",
                    data: data,
                    headers: {'Content-Type': undefined}
                }).then(resolve, function(error) {
                    console.log("postFiles result ", error);
                    errorHandler(error.data.message, showMsg);
                    reject( error );
                });
            });
        }

        return factory;
    })
    .factory("pagination", function(Backend,SharedPref, $q, $timeout) {
        var factory = this;
        factory.settings = {
            search: "",
            args: {

            },
            currentPage: 1,
            currentUrl: "",
            scope: { obj: null, key: '' }
        };
        factory.didSearch = false;
        factory.meta = {}; // saved by backend
        var searchTimer = null;
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
            if (current === factory.meta.pagination.total_pages || factory.meta.pagination.total_pages === 0) {
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
            if (factory.settings.search !== "") {
                url += "&search=" + encodeURIComponent(factory.settings.search);
            }
            for ( var index in factory.settings.args ) {
                var arg = factory.settings.args[ index ];
                if ( arg !== '' && arg ) {
                    url += "&" + index + "=" + encodeURIComponent(arg);
                }
            }
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
        factory.resetSearch = function() {
            searchTimer = null;
            factory.settings.search = "";
            factory.didSearch = false;
        }
        factory.search = function() {
            factory.didSearch = true;
            if (searchTimer !== null) {
                $timeout.cancel(searchTimer);  //clear any running timeout on key up
            }
            searchTimer = $timeout(function() { //then give it a second to see if the user is finished
                    //do .post ajax request //then do the ajax call
                    factory.loadData();
            }, 500);
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
        url: '/welcome',
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
    .state('ports', {
        url: '/dids/ports', 
        parent: 'dashboard',
        templateUrl: 'views/pages/did/ports/numbers.html',
        controller: 'PortNumbersCtrl'
    })
    .state('port-create', {
        url: '/dids/ports/create', 
        parent: 'dashboard',
        templateUrl: 'views/pages/did/ports/create-port.html',
        controller: 'CreatePortCtrl'
    })
    .state('port-edit', {
        url: '/dids/ports/{numberId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/ports/edit-port.html',
        controller: 'EditPortCtrl'
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
    .state('debugger-logs', {
        url: '/debugger-logs',
        parent: 'dashboard',
        templateUrl: 'views/pages/debugger-logs.html',
        controller: 'DebuggerLogsCtrl'
    })
    .state('debugger-log-view', {
        url: '/debugger-logs/{logId}/view',
        parent: 'dashboard',
        templateUrl: 'views/pages/log-view.html',
        controller: 'DebuggerLogViewCtrl'
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
    .state('settings-verified-callerids', {
        url: '/settings/verified-callerids',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/verified-callerids.html',
        controller: 'VerifiedCallerIdsCtrl'
    })
    .state('settings-verified-callerids-create', {
        url: '/settings/verified-callerids/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/verified-callerids-create.html',
        controller: 'VerifiedCallerIdsCreateCtrl'
    })
    .state('settings-blocked-numbers', {
        url: '/settings/blocked-numbers',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/blocked-numbers.html',
        controller: 'BlockedNumbersCtrl'
    })
    .state('settings-blocked-numbers-create', {
        url: '/settings/blocked-numbers/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/blocked-numbers-create.html',
        controller: 'BlockedNumbersCreateCtrl'
    })
    .state('settings-ip-whitelist', {
        url: '/settings/ip-whitelist',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/ip-whitelist.html',
        controller: 'IpWhitelistCtrl'
    })
    .state('settings-workspace-users', {
        url: '/settings/workspace-users',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users.html',
        controller: 'WorkspaceUserCtrl'
    })
    .state('settings-workspace-params', {
        url: '/settings/workspace-params',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-params.html',
        controller: 'WorkspaceParamCtrl'
    })

    .state('settings-workspace-users-create', {
        url: '/settings/workspace-users/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users-create.html',
        controller: 'WorkspaceUserCreateCtrl'
    })
    .state('settings-workspace-users-edit', {
        url: '/settings/workspace-users/{userId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users-edit.html',
        controller: 'WorkspaceUserEditCtrl'
    })
    .state('settings-extension-codes', {

        url: '/settings/extension-codes',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/extension-codes.html',
        controller: 'ExtensionCodesCtrl'
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


