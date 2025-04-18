'use strict';

/**
* @ngdoc overview
* @name Lineblocs
* @description
* # Lineblocs
*
* Main module of the application.
*/
window.app_version = 2.0;
    function loadAddedResources1() {
        //addScript("https://js.stripe.com/v2/");
        addScript("https://js.stripe.com/v3/");
    }

    // add CSS file
    function addCSS(filename) {
        var head = document.getElementsByTagName('head')[0];

        var style = document.createElement('link');
        style.href = filename;
        style.type = 'text/css';
        style.rel = 'stylesheet';
        head.appendChild(style);
    }

    // add script file
    function addScript(filename) {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.src = filename;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
function checkExpires(expiresIn)
{

}

function createBaseTitle() {
    return DEPLOYMENT_DOMAIN;
}
function getEditorPath() {
        return  "https://editor." + DEPLOYMENT_DOMAIN;
}
function isAlreadyDoingNextRedirect() {
    var hash = window.location.hash.substr(1);
    var query = URI( hash ).query( true );
    if ( query.next ) {
        return true;
    }
    return false;
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
            return "Bearer " + parsed.token.auth;
    }
    return "";
}
function getWorkspaceID() {
    var workspace =getWorkspace();
   if ( !workspace ) {
        return null;
    }
    return workspace.id;
}
function getWorkspace() {
    var workspace =localStorage.getItem("WORKSPACE")
    if ( !workspace ) {
        return null;
    }
    var parsed = JSON.parse(workspace);
    return parsed;
}
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function getBaseUrl() {
    var check1 = document.location.href.includes("http://localhost");
    var check2 = document.location.href.includes("ngrok.io");
    var version = "v1";
    if (check1 || check2) {
        var baseUrl = "https://" + DEPLOYMENT_DOMAIN;
    } else {
        //var baseUrl = "/api";
        var baseUrl = "https://" + DEPLOYMENT_DOMAIN;
    }

    return baseUrl;
}

function createUrl(path) {
    var version = "v1";
    return getBaseUrl() + "/api/" + version + path;
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
function continueChangeRoute() {
    var scope = angular.element(document.getElementById('scopeCtrl')).scope();
    var info = scope.$shared.pendingRouteData;
    scope.$shared.completeChangeRoute(info.route, info.params);
    scope.$apply();
}

window.addEventListener('message', function(e) {
    var editorUrl = getEditorPath();
    if (event.origin.startsWith(editorUrl)) {
      if ( event.data === 'saved' ) {
          continueChangeRoute();
      } else {
                var confirm = window.confirm("Are you sure any unsaved changes will be lost.");
                if ( !confirm ) {
                    return;
                }
                continueChangeRoute();
      }

    }
});
angular
.module('Lineblocs', [
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'chart.js',
    'pascalprecht.translate',
    'md.data.table',
    'ngIdle',
    'ngclipboard'
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
                var adminToken = localStorage.getItem("ADMIN_TOKEN");
                if (adminToken) {
                    config.headers['X-Admin-Token'] = adminToken;
                }

                return config;
            }
        };
    })
    .factory("$shared", function($state, $mdDialog, $timeout, $q, $window, $location, $mdToast, ThemeService) {
        var factory = this;
        var baseTitle = createBaseTitle();
        factory.tempStopErrors = false;
        factory.selectedAdminWorkspace = null;
        factory.initialLoaded = false;
        factory.title = baseTitle;
        factory.FLOW_EDITOR_URL = getEditorPath();
        factory.SHOW_NAVBAR = true;
        factory.PAGE_CONTENT_NO_PADDING = false;
        factory.isLoading = true;
        factory.currentWorkspace = "";
        factory.billingCountries = [];
  factory.ranges = [
        "/8",
        "/16",
        "/24",
        "/32"
      ];
  factory.acSearch = {
      isDisabled: false,
      noCache:true,
      selectedItem: null,
  };
        factory.billingPackages = ['gold', 'silver', 'bronze'];
        factory.customizations = {


        };
  var flickerTimeout = 0;

    function searchModule(text, state, tags, stateParams, perms, setting)
    {
        tags = tags || [];
        stateParams= stateParams || {};
        perms = perms || [];
        setting = setting || null;
        return {
            display: text,
            state: state,
            tags: tags,
            stateParams: stateParams,
            perms: perms,
            setting: setting
        }
    }
     var modules = [
searchModule("Blocked Numbers", "settings-blocked-numbers", ['blocked', 'numbers']),
//searchModule("Add Blocked Number", "settings-blocked-numbers-create", ['add', 'blocked', 'number']),
searchModule("IP Whitelist", "settings-ip-whitelist", ['ip', 'whitelist']),
searchModule("API Settings", "settings-workspace-api-settings", ['api']),
searchModule("Workspace Users", "settings-workspace-users", ['workspace', 'users'], [], ['manage_users']),
searchModule("Workspace Params", "settings-workspace-params", ['workspace', 'params']),
searchModule("Add Workspace User", "settings-workspace-users-create", ['add', 'workspace', 'user']),
searchModule("Extension Codes", "settings-extension-codes", ['extension', 'codes']),
searchModule("Media Files", "files", ['media', 'files', 'media files']),
searchModule("Phones", "phones-phones", ['provision', 'phones'], [], ['manage_phones']),
searchModule("Add Phone", "phones-phone-create", ['add', 'phone'], [], ['manage_phones']),
searchModule("Phones Groups", "phones-groups", ['phones', 'groups'], [], ['manage_phonegroups']),
searchModule("Add Phone Group", "phones-groups-create", ['add', 'group'], [], ['create_phonegroup']),
searchModule("Phone Global Templates", "phones-global-settings", ['phones', 'global', 'templates'], [], ['manage_phoneglobalsettings']),
searchModule("Phone Individual Settings", "phones-individual-settings", ['phones', 'individual', 'settings'],[], ['manage_phoneindividualsetting']),
searchModule("Deploy Phone Config", "phones-deploy-config", ['provision', 'phone', 'config', 'deploy'], [], ['manage_phones']),
searchModule("My Numbers", "my-numbers", ['my', 'numbers'], [], ['manage_dids']),
searchModule("Buy Numbers", "buy-numbers", ['buy', 'numbers'], [], ['manage_dids']),
searchModule("Port-In Requests", "ports", ['port', 'requests', 'port in', 'dids'], [], ['manage_ports']),
searchModule("Create Port Request", "port-create", ['port', 'create', 'dids'], [], ['manage_ports']),
searchModule("Flows", "flows", ['flows', 'flow editor'], [], ['manage_flows']),
searchModule("Flow Editor", "flow-editor", ['flow editor'], {"flowId": "new"}, ['create_flow']),
searchModule("Extensions", "extensions", ['extensions'],[], ['manage_extensions']),
searchModule('Add Extension', "extension-create", ['add', 'extension'], [], ['create_extensions']),
searchModule("Logs", "debugger-logs", ['debugger logs', 'logs', 'debugger']),
searchModule("Calls", "calls", ['calls'], [], ['manage_calls']),
searchModule("Recordings", "recordings", ['recordings'], [], ['manage_recordings']),
searchModule("Faxes", "faxes", ['fax', 'faxes']),
searchModule("Billing", "billing", ['billing', 'add card', 'cards', 'settings'], [], ['manage_billing']),
searchModule("BYO Carriers", "byo-carriers", ['byo', 'carriers'], [], ['manage_byo_carriers'], 'bring_carrier'),
searchModule("BYO DID Numbers", "byo-did-numbers", ['byo', 'did numbers', 'did', 'numbers'], [], ['manage_byo_did_numbers'], 'bring_carrier'),
searchModule("Support", "support", ['support'], [], ['support']),
     ];

     factory.centsToDollars = function(cents, addDollarSign) {
        addDollarSign = addDollarSign||false;
        // Convert to dollars and ensure 2 decimal places
        const dollars = (cents / 100).toFixed(2);
        // Return with or without dollar sign based on parameter
        return addDollarSign ? `$${dollars}` : dollars;
     }
     factory.isSectionActive = function(area) {
         var current = factory.state.name;
         var maps = {
            'my-numbers': [
                'my-numbers',
                'my-numbers-edit',
            ],
            'buy-numbers': [
                'buy-numbers',
                'buy-numbers-select',
            ],
            'buy-numbers': [
                'buy-numbers',
                'buy-numbers-select',
            ],
            'ports': [
                'port-create',
                'port-edit',
            ],
            'flows': [
                'flows',
                'flow-editor'
            ],
            'flows': [
                'flows',
                'flow-editor'
            ],
            'extensions': [
                'extensions',
                'extension-create',
                'extension-edit'
            ],
            'recordings': [
                'recordings'
            ],
            'faxes': [
                'faxes'
            ],
            'files': [
                'files'
            ],
            'settings-workspace-users': [
                'settings-workspace-users',
                'settings-workspace-users-create',
                'settings-workspace-users-edit',
                'settings-workspace-users-assign',
            ],
            'billing': [
                'billing',
                'billing-add-card',
                'billing-upgrade-submit',
                'billing-upgrade-complete',
                'billing-upgrade-plan',
                'cancel-subscription'
            ],
            'support': [
                'support',
            ],

         }
         var item = maps[area];
         if ( item && item.includes( current ) ) {
             return true;
         }
     }
    factory.getDomain = function() {
            return  DEPLOYMENT_DOMAIN;
    }


    factory.getHomeLink = function() {
            return  "https://" + DEPLOYMENT_DOMAIN + "/";
    }

    factory.getAppPortalDomain = function(workspace, suffixOnly) {
        suffixOnly = suffixOnly||true;
        var domain = "app." + DEPLOYMENT_DOMAIN;
        if ( workspace ) {
            domain = workspace + ".app." + DEPLOYMENT_DOMAIN;
            if ( suffixOnly ) {
                domain = "app." + DEPLOYMENT_DOMAIN;
            }
        }
        return domain;
    }
    factory.getEditorResource = function(path) {
            return  getEditorPath() + "/" + path;
    }
    factory.createDomainLink = function(path) {
            return  factory.getHomeLink() + path;
    }
     factory.getAppLogo = function() {
        var logo = factory.customizations['app_logo'];
        if ( !logo || logo === '' ) {
                return '/images/new-logo-blue.png';
        }
        return getBaseUrl() + "/assets/img/" + logo;
     }
     factory.getAppIcon = function() {
        var icon = factory.customizations['app_icon'];
        console.log('loading icon ', icon)

        if ( !icon || icon === '' ) {
                return '/images/logo-icon-white.png';
        }
        return getBaseUrl() + "/assets/img/" + icon;
     }
     factory.getAltAppLogo = function() {
        var logo = factory.customizations['alt_app_logo'];
        if ( !logo || logo === '' ) {
            return '/images/new-logo-blue.png';
        }
        return getBaseUrl() + "/assets/img/" + logo;
        
     }
     factory.createCardLabel = function(card) {
        return "**** **** **** " + card.last_4;
     }

     factory.getCurrentTheme = function() {
        var theme = localStorage.getItem("THEME");
        if ( !theme ) {
            theme = "default";
        }
        return theme;
      }
	factory.getCardImg = function(card) {
        console.log("getCardImg ", card);
	    return 	'/images/cards/' + card.issuer + '.png'
	}
        factory.isInLoadingState = function() {
            var check = factory.isLoading || factory.isCreateLoading;
            console.log("checked loading: ", check);
            return check;
        }
        factory.hasAuth = function() {
            var token = localStorage.getItem("AUTH");
            return token;
        }

        factory.cancelForm = function() {
            $window.history.back();
        }

        factory.navigateDashboard = function(){
            $state.go('dashboard', {});
        }
     factory.changeAdminWorkspace = function(workspace) {
         console.log("changeAdminWorkspace ", workspace);
         factory.setWorkspace( workspace );
         $state.reload();
     }
        factory.changeAdminWorkspace2 = function(workspace) {
         console.log("changeAdminWorkspace ", workspace);
         factory.setWorkspace( workspace );
     }

     factory.getWorkspace = function() {
         return getWorkspace();
     }

     factory.isSettingEnabled = function(option) {

            if ( factory.planInfo ) {
                if ( factory.planInfo[ option ] ) {
                    return true;
                }
            }
            return false;
     }
     factory.hasPermission = function(option) {
        console.log("hasPermission", option);
            if ( factory.workspaceInfo ) {
                if ( factory.workspaceInfo.user_info[option] ) {
                    return true;
                }
            }
            return false;
     }
     factory.planName = function(option) {
         var workspace = getWorkspace();
         return workspace.plan;
     }

     factory.deleteAllChecked = function(module, items) {
         var checked = items.filter(function(item) {
             return item.checked;
         });
         console.log("checked items are ", checked);
if (checked.length === 0) {
             factory.showMsg("Error", "Please select one or more items to delete");
             return;
         }

         var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete all these items?')
          .ariaLabel('Confirm')
          .ok('Yes')
          .cancel('No');
        $mdDialog.show(confirm).then(function() {
            factory.isLoading = true;
            var data = {
                "module": module,
                "items": checked
            };
            Backend.post("/deleteAll", data).then(function() {
                console.log("deleted successfully..");
            })
        });
     }

     factory.cleanWorkspaceName = function(name) {
var changed = name.toLowerCase();
changed = changed.replace(/[^a-z0-9\-]/g, "");
return changed;
}
    factory.querySearch  = function(query) {
        console.log("querySearch query is: " + query);
        return $q(function(resolve, reject) {
            var regexp = new RegExp(".*" + query.toLowerCase() + ".*");
            var results = [];
            angular.forEach(modules, function(module) {

                console.log("searching on " + module.display + " agaisnt " + query);
                var hasPerms = true;


                var perms = module.perms;
                console.log("checking perms ", perms);
                angular.forEach(perms, function(perm) {
                    if (!factory.hasPermission(perm)) {
                        hasPerms = false;
                    }
                });
                if (!hasPerms) {
                    return;
                }

                //check for setting
                var setting = module.setting;
                if (setting !== null && !factory.isSettingEnabled(setting)) {
                    return false;
                }
                var matched = module.display.toLowerCase().match( regexp );
                if ( matched ) {
                    results.push(module);
                }
            });
            //tag search
            angular.forEach(modules, function(module) {
                if (results.indexOf(module)>-1) {
                    return;
                }

                var hasPerms = true;


                var perms = module.perms;
                console.log("checking perms ", perms);
                angular.forEach(perms, function(perm) {
                    if (!factory.hasPermission(perm)) {
                        hasPerms = false;
                    }
                });
                if (!hasPerms) {
                    return;
                }

                //check for setting
                var setting = module.setting;
                if (setting !== null && !factory.isSettingEnabled(setting)) {
                    return false;
                }
                angular.forEach(module.tags, function(tag) {
                    console.log("searching on " + tag + " agaisnt " + query);
                    var matched = tag.toLowerCase().match( regexp );
                    if ( matched ) {
                        results.push(module);
                    }
                });
            });

            return resolve(results);
        });
    }
    factory.searchTextChange = function(text) {
        console.log("searchTextChange");
    }
    factory.selectedItemChange = function(item) {
      console.log('Item changed to ' + JSON.stringify(item));
      if (item && item.ui_identifier) $state.go(item.ui_identifier, {});
    }

  factory.showToast = function(msg, position, delayMs) {
      delayMs = delayMs||3000;
      var position = position || "top right";
                    $mdToast.show(
                    $mdToast.simple()
                        .textContent(msg)
                        .position(position)
                        .hideDelay(delayMs)
                    );
  }



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
  factory.nullIfEmpty = function(value) {
    if ( !value || value === "" ) {
        return null;
    }
    return value;
  }
  factory.scrollToTop = function() {
      $window.scrollTo(0, 0);
  }
  factory.completeChangeRoute = function(route, params, other) {
      $state.go(route, params, other);
      $timeout(function() {

      }, 0);

  }
  factory.changeRoute = function(route, params, force, createLoad) {
      console.log("changeRoute called ", arguments);
      force = force || false;
      createLoad = createLoad || false;
      var params = params || {};
      var except = ['flow-editor'];
      if ((factory.state && factory.state.name === route) && !force) {
        return;
      }
        if ( factory.state.name === 'flow-editor' ) {
            var flowEditorFrame = document.getElementById('flowEditorFrame');
            // check if all changes are saved before exiting
            if ( flowEditorFrame ) {
                flowEditorFrame.contentWindow.postMessage('check', '*');
                factory.pendingRouteData = {
                    route: route,
                    params: params
                };
                return;
            }
      }

      if (!except.includes(route)) {
          if ( createLoad ) {
              factory.isCreateLoading = true;
          } else {
                factory.isLoading = true;
        }
      }
    factory.completeChangeRoute(route, params, {"reload": false});
  }
        factory.collapseNavbar = function() {
            factory.SHOW_NAVBAR = false;
            factory.PAGE_CONTENT_NO_PADDING = true;
            factory.COLLAPSED_MODE = false;
            $( '.c-hamburger' ).removeClass('is-active');
            $('body').removeClass('extended');
        }
        factory.collapseNavbarPadding = function() {
            factory.SHOW_NAVBAR = true;
            factory.PAGE_CONTENT_NO_PADDING = false;
            factory.COLLAPSED_MODE = true;
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
            factory.COLLAPSED_MODE = false;
            $( '.c-hamburger' ).addClass('is-active');
            $('body').addClass('extended');
        }
        factory.doLogout = function() {
            factory.purgeSession();
            var theme = $window.localStorage.THEME;
            localStorage.clear();
            $window.localStorage.setItem('THEME', theme);
            ThemeService.addStyle("styles/app-blue.css");
            $state.go('login', {});
        }
        factory.setAuthToken = function(token) {
            localStorage.setItem("AUTH", JSON.stringify(token));
        }
        factory.setAdminAuthToken = function(token) {
                localStorage.setItem("ADMIN_TOKEN", token);
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
        factory.purgeSession =  function() {
            localStorage.removeItem("WORKSPACE");
            localStorage.removeItem("AUTH");
            localStorage.removeItem("ADMIN_TOKEN");
        }
        factory.canPerformAction = function(action) {
            var workspace = factory.getWorkspace();
            if (workspace && workspace.user_info && workspace.user_info[action]) {
                return true;
            }
            return false;
        }
        factory.has = function() {
            return JSON.parse(localStorage.getItem("WORKSPACE"));
        }
        factory.showMsg = function(title, msg) {
                factory.changingPage = false;
                factory.endIsCreateLoading();
                factory.endIsLoading();
                return $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(msg)
                    .ariaLabel(title)
                    .ok('Ok')
                );

        }


        factory.showError = function(title, msg) {
                factory.changingPage = false;
                factory.endIsCreateLoading();
                factory.endIsLoading();
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
    .factory("Backend", function($http, $q, $shared, $mdDialog, $state, $timeout, ThemeService) {
        var factory = this;
        factory.queued = [];
        var skip = ['login', 'register', 'forgot', 'reset'];

        function pushToQueue(item) {
            $shared.tempStopErrors = true;
            //factory.queued.push( item );
        }
        function errorHandler(res, codeId, showMsg) {
            var error = null;
            if ( res.data ) {
                error = res.data.message||null;
            }
            console.log("erroHandler ", arguments);
            /*
            if ( $shared.tempStopErrors ) {
                $q.all( factory.queued ).then(function() {
                    $shared.tempStopErrors = false;
                });
                return;
            }
            */
            $shared.endIsLoading();
            $shared.endIsCreateLoading();
            if ( showMsg ) {
                    error = error || "An error occured.";
                    $shared.showError(error);
                    return;
            }
            var message = "An error occured.";
            if ( codeId !== null) {
                message += " Error Code ID: " + codeId;
            }

            $shared.showError(message);

        }

      factory.applyTheme = function(theme) {
        theme = theme||ThemeService.getTheme();
        const themes = {
          default: 'styles/app-blue.css',
          dark: 'styles/app-grey.css'
        }

        if (theme !== ThemeService.getTheme()) {
          ThemeService.setTheme(theme);
        }
        ThemeService.addStyle(themes[theme]);
        //ThemeService.removeStyle(themes[theme]);
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            ThemeService.setTheme('dark');
        }else{
            ThemeService.setTheme('default');
        }
      }

     factory.refreshWorkspaceData = function() {
         return $q(function(resolve, reject) {
            factory.get("/dashboard").then(function(res) {
                var graph = res.data[0];
                console.log("GOT state data ", res);
				$shared.billInfo=  res.data[1];
                $shared.userInfo=  res.data[2];
                factory.applyTheme($shared.userInfo.theme);
                $shared.planInfo=  res.data[4];
                // $shared.planInfo.rank = 3;
                $shared.workspaceInfo=  res.data[5];
                console.log("updated UI state");
                resolve(res);
            }, function(err) {
                reject(err);
            });
        });
    }
        factory.selectAll = function(selectedAll, tag, options) {
            console.log("selectAll", selectedAll);
            angular.forEach(options, function(option) {
                option.checked = selectedAll;
            });


        }
         factory.deleteAllChecked = function(module, items) {
         var checked = items.filter(function(item) {
             return item.checked;
         });
         console.log("checked items are ", checked);
if (checked.length === 0) {
             $shared.showMsg("Error", "Please select one or more items to delete");
             return;
         }
         var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete all these items?')
          .ariaLabel('Confirm')
          .ok('Yes')
          .cancel('No');
        $mdDialog.show(confirm).then(function() {
            $shared.isLoading = true;
            var data = {
                "module": module,
                "items": checked
            };
            factory.post("/deleteAll", data).then(function() {
                console.log("deleted successfully..");
                $shared.isLoading = false;
                $state.reload();
            })
        });
     }


        factory.waitForQueuedReqs = function() {
            return $q(function(resolve, reject) {
                 $q.all( factory.queued ).then(function() {
                     resolve();
                 });
                });
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

        function checkHttpCallPrerequisites() {
            var auth = $shared.hasAuth();
            if ( !auth ) {
                $shared.tempStopErrors = true;
                var path = document.location.href.split("/");

                if (isAlreadyDoingNextRedirect()) {
                    return;
                }
                var next = path.slice(4, path.length).join("/");
                //var next = $state.current.name;
                console.log("next URL is: ", next);
                console.log("current state is ", $state.current);
                window.location.replace("/#/login?next=" + next);
                //$state.go('login');
                return false;
            }
            return true;
        }
        factory.get = function(path, params, showMsg)
        {
            var item = $q(function(resolve, reject) {
                    if (!skip.includes($state.current.name) && $state.current_name) {
                        if ( !checkHttpCallPrerequisites() ) {
                            resolve();
                            return;
                        }

                    }
                    $http.get(createUrl(path), params).then(resolve,function(res) {
                        console.log('received reply ', res);
                        errorHandler(res, res.headers('X-ErrorCode-ID'), showMsg);
                        reject(res);
                    });
            });
            pushToQueue( item );
            return item;
        }

        factory.getPagination = function(path, params)
        {
            path = path + "?page=" + pagination.getCurrentPage();
            return factory.get(path, params);
        }

        factory.delete = function(path, showMsg)
        {
            var item = $q(function(resolve, reject) {
                 if (!skip.includes($state.current.name)) {
                    if ( !checkHttpCallPrerequisites() ) {
                        resolve();
                        return;
                    }
                }


                $http.delete(createUrl(path)).then(resolve,function(res) {
                    errorHandler(res, res.headers('X-ErrorCode-ID'), showMsg);

                    reject(res);
                 });
            });
            pushToQueue(item);
            return item;

        }
        factory.post = function(path, params, suppressErrDialog, showMsg)
        {
            var item =  $q(function(resolve, reject) {
                console.log("factory.post current state is: ", $state.current.name);
                    if (!skip.includes($state.current.name)) {
                        if ( !checkHttpCallPrerequisites() ) {

                            resolve();
                            return;
                        }
                    }


                $http.post(createUrl(path), params).then(resolve,function(res) {
                    if (!suppressErrDialog) {
                        errorHandler(res, res.headers('X-ErrorCode-ID'), showMsg);

                    }
                    reject(res);
                 });
            });
            pushToQueue( item );
            return item;
        }
        factory.postCouldError = function(path, params)
        {
            $shared.tempStopErrors = false;
            return factory.post(path, params, false, true);
        }

        factory.postFiles =  function(url, data, showMsg) {
            var item =$q(function(resolve, reject) {
                 if (!skip.includes($state.current.name)) {
                    if ( !checkHttpCallPrerequisites() ) {
                        resolve();
                        return;
                    }
                }


                $http({

                    url: createUrl(url),
                    method: "POST",
                    data: data,
                    headers: {'Content-Type': undefined}
                }).then(resolve, function(res) {
                    console.log("postFiles result ", res);
                    errorHandler(res, res.headers('X-ErrorCode-ID'), showMsg);
                    reject( res );
                });
            });
            pushToQueue( item );
            return item;
        }
        factory.put = function(path, params, suppressErrDialog, showMsg)
        {
            var item =  $q(function(resolve, reject) {
                console.log("factory.post current state is: ", $state.current.name);
                    if (!skip.includes($state.current.name)) {
                        if ( !checkHttpCallPrerequisites() ) {

                            resolve();
                            return;
                        }
                    }


                $http.put(createUrl(path), params).then(resolve,function(res) {
                    if (!suppressErrDialog) {
                        errorHandler(res, res.headers('X-ErrorCode-ID'), showMsg);

                    }
                    reject(res);
                 });
            });
            pushToQueue( item );
            return item;
        }


        return factory;
    })
    .factory("pagination", function(Backend,$shared, $q, $timeout, $location, $stateParams) {
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
        factory.getCurrentPage = function() {
            return parseInt($stateParams['page']);
        }
        factory.clearSearch = function() {
            $shared.changeRoute('.', {'page': 1, 'search': ''}, true /** force */, true);
        }
        factory.shouldShowClear = function() {
            var result = false;
            if ( factory.settings.search === "" ) {
                result = false;
            } else {
                result = true;
            }
            console.log("result ", result);
            return result;
        }
        factory.nextPage = function() {
            var page = factory.getCurrentPage() + 1;
            $shared.changeRoute('.', {'page': page,"search": $stateParams['search']}, true /** force */, true);
        }
        factory.prevPage = function() {
            var page = factory.getCurrentPage() - 1;
            $shared.changeRoute('.', {'page': page, "search": $stateParams['search']}, true /** force */, true);
        }
        factory.hasNext = function() {
            var current = factory.getCurrentPage();
            if (factory.meta && factory.meta.pagination && (current === factory.meta.pagination.total_pages || factory.meta.pagination.total_pages === 0)) {
                return false;
            }
            return true;
        }
        factory.hasPrev = function() {
            var current = factory.getCurrentPage();
            if (current === 1) {
                return false;
            }
            return true;
        }



        // NOT USED
        factory.changePage = function( page ) {
            factory.settings.search = $stateParams['search']||'';
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
        factory.loadData = function(params) {
            params = params || {};
            var url = factory.settings.currentUrl;
            params['?page'] = factory.getCurrentPage();

            if (factory.settings.search !== "") {
                params['search'] = encodeURIComponent(factory.settings.search);
            }
            for ( var index in factory.settings.args ) {
                var arg = factory.settings.args[ index ];
                if ( arg !== '' && arg ) {
                    //url += "&" + index + "=" + encodeURIComponent(arg);
                    params[index] = encodeURIComponent(arg);
                }
            }

            $shared.isCreateLoading = true;
            return $q(function(resolve, reject) {
                Backend.get(url, {params: params}).then(function(res) {
                    var meta = res.data.meta;
                    factory.meta = meta;
                    var scopeObj = factory.settings.scope.obj
                    var key = factory.settings.scope.key;
                    scopeObj[ key ] = res.data.data;
                    console.log("loaded data ", scopeObj[key]);
                    console.log("loaded data meta", meta);
                    $shared.endIsCreateLoading();
                    $shared.endIsLoading();
                    $timeout(function() {
                        scopeObj.$apply();
                        resolve(res);
                    }, 0);
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
        factory.checkIfSearched = function() {
            if ( $stateParams['search'] !== '' ) {
                return true;
            }
            return false;
        }
        factory.search = function() {
            factory.didSearch = true;
            if (searchTimer !== null) {
                $timeout.cancel(searchTimer);  //clear any running timeout on key up
            }
            searchTimer = $timeout(function() { //then give it a second to see if the user is finished
                    //do .post ajax request //then do the ajax call
                    //var page = $stateParams['page'];
                    var page = "1";

                    console.log("SEARCH IS ", factory.settings.search);
                    $shared.changeRoute('.', {'page': page,"search": factory.settings.search}, true /** force */, true);
                    //factory.loadData();
            }, 800);
        }
        return factory;
    })
    .config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider) {
         $httpProvider.interceptors.push('JWTHttpInterceptor');
      //  $locationProvider.html5Mode(true);
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
        // function to check the authentication //
    var Auth = ["$q", "$state", "$timeout", "$window", "$shared", function ($q, $state, $timeout, $window, $shared) {
        var deferred =$q.defer();

        function redirectToLoginPage() {
            console.log("not logged in...");
            if (isAlreadyDoingNextRedirect()) {
                return;
            }
            var path = document.location.href.split("/");
            var next = path.slice(4, path.length).join("/");
            //var next = $state.current.name;
            console.log("next URL is: ", next);
            console.log("current state is ", $state.current);
            window.location.replace("/#/login?next=" + next);
            //$state.go('login', {'next': next});
            deferred.reject();
        }
        $timeout(function() {
            console.log("checking auth token..");
            var token = getJWTTokenObj();
            var skip = ['login', 'register', 'forgot', 'reset'];
            $shared.tempStopErrors = true;
            if (skip.includes($state.current.name)) {
                return deferred.resolve();
            }
            if (token!==''&&token) {
                $shared.tempStopErrors = false;
                var expiryTimePadding = (3600*5);
                var expiryInUnix = token['expire_in_timestamp'];
                var currentUnixTime = moment().unix()
                if (currentUnixTime >= (expiryInUnix-expiryTimePadding)) {
                    redirectToLoginPage();
                    return;
                }

                return deferred.resolve();
            } else {
                redirectToLoginPage();
            }
        }, 0);
    }];
    var resolveParams = {
                auth: Auth
        };
    var listPageParams = {
              page: {
            value: '1',
            squash: true
            },
            search: {
            value: '',
            squash: true
            }
    };
var regParams = {
    };

    $stateProvider
    .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html',
        controller: 'DashboardCtrl'

    })
    .state('join-workspace', {
        url: '/join-workspace/:hash',
        parent: 'base',
        templateUrl: 'views/pages/join-workspace.html',
        controller: 'JoinWorkspaceCtrl'
    })
    .state('login', {
        url: '/login',
        parent: 'base',
        templateUrl: 'views/pages/login.html',
        controller: 'LoginCtrl'
    })
    .state('register', {
        url: '/register?plan',
        parent: 'base',
        templateUrl: 'views/pages/register.html',
        controller: 'RegisterCtrl',
        params: regParams
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
        url: '/404',
        parent: 'base',
        templateUrl: 'views/pages/404-page.html',
        controller: 'NotFoundCtrl'
    })
    .state('dashboard', {
        url: '/dashboard',
        parent: 'base',
        templateUrl: 'views/layouts/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: resolveParams
    })
    .state('404-dash', {
        url: '/logged/404',
        parent: 'dashboard',
        templateUrl: 'views/pages/404-dash-page.html',
    })
    .state('dashboard-user-welcome', {
        url: '/welcome',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard-welcome.html',
        controller: 'DashboardWelcomeCtrl',
        resolve: resolveParams
    })
    .state('dashboard-redirect', {
        url: '/dashboard-redirect',
        parent: 'base',
        templateUrl: 'views/pages/dashboard-redirect.html',
        controller: 'DashboardRedirectCtrl'
    })
    .state('my-numbers', {
        url: '/dids/my-numbers?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/my-numbers.html',
        controller: 'MyNumbersCtrl',
        params:  listPageParams
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
    .state('buy-numbers-select', {
        url: '/dids/buy-numbers/{type}',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/buy-numbers.html',
        controller: 'BuyNumbersCtrl'
    })
    .state('ports', {
        url: '/dids/ports?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/did/ports/numbers.html',
        controller: 'PortNumbersCtrl',
        params:  listPageParams
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
        url: '/flows?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/flows.html',
        controller: 'FlowsCtrl',
        params:  listPageParams
    })
    .state('flow-editor', {
        url: '/flows/{flowId}',
        parent: 'dashboard',
        templateUrl: 'views/pages/flow-editor.html',
        controller: 'FlowEditorCtrl'
    })
    .state('extensions', {
        url: '/extensions?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/extensions.html',
        controller: 'ExtensionsCtrl',
        params:  listPageParams
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
        url: '/call-monitor?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/debugger-logs.html',
        controller: 'DebuggerLogsCtrl',
        params:  listPageParams
    })
    .state('debugger-log-view', {
        url: '/call-monitor/{logId}/view',
        parent: 'dashboard',
        templateUrl: 'views/pages/log-view.html',
        controller: 'DebuggerLogViewCtrl'
    })
    .state('calls', {
        url: '/calls?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/calls.html',
        controller: 'CallsCtrl',
        params:  listPageParams
    })
    .state('call-view', {
        url: '/call/{callId}/view',
        parent: 'dashboard',
        templateUrl: 'views/pages/call-view.html',
        controller: 'CallViewCtrl'
    })
    .state('recordings', {
        url: '/recordings?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/recordings.html',

        controller: 'RecordingsCtrl',
        params:  listPageParams
    })
    .state('faxes', {
        url: '/faxes?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/faxes.html',
        controller: 'FaxesCtrl',
        params:  listPageParams
    })
    .state('support', {
        url: '/support?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/support.html',
        controller: 'SupportCtrl',
        params:  listPageParams
    })
    .state('support-create', {
        url: '/support/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/support-create.html',
        controller: 'SupportCreateCtrl'
    })
    .state('support-update', {
        url: '/support/{ticketId}/update',
        parent: 'dashboard',
        templateUrl: 'views/pages/support-update.html',
        controller: 'SupportUpdateCtrl'
    })
    .state('billing', {
        url: '/billing?frm',
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
    .state('billing-fix-paypal-billing-agreement', {
        url: '/billing/fix-paypal-billing-agreement',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing-fix-paypal-billing-agreement.html',
        controller: 'BillingFixPaypalAgreementCtrl'
    })
    .state('billing-upgrade-plan', {
        url: '/billing/upgrade-plan',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing-upgrade.html',
        controller: 'BillingUpgradePlanCtrl'
    })
    .state('billing-upgrade-submit', {
        url: '/billing/upgrade-submit?plan',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing-upgrade-submit.html',
        controller: 'BillingUpgradeSubmitCtrl',
        params: {
              plan: {
            value: 'pay-as-you-go',
            squash: true
            }
        }
    })
    .state('billing-upgrade-complete', {
        url: '/billing/upgrade-complete',
        parent: 'dashboard',
        templateUrl: 'views/pages/billing-upgrade-complete.html',
        controller: 'BillingUpgradeCompleteCtrl',
    })
    .state('billing-cancel-subscription', {
      url: '/billing/cancel-subscription',
      parent: 'dashboard',
      templateUrl: 'views/pages/billing-cancel-subscription.html',
      controller: 'CancelSubscriptionCtrl',
  })
    .state('billing-make-payment', {
        url: '/billing/make-payment',
        parent: 'dashboard',
        templateUrl: 'views/pages/make-payment.html',
        controller: 'MakePaymentCtrl'
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
        url: '/users',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users.html',
        controller: 'WorkspaceUserCtrl'
    })
    .state('settings-workspace-options', {
        url: '/settings/workspace-options',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-options.html',
        controller: 'WorkspaceOptionsCtrl'
    })
    .state('settings-workspace-api-settings', {
        url: '/settings/workspace-api-settings',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-api-settings.html',
        controller: 'WorkspaceAPISettingsCtrl'
    })
    .state('settings-workspace-params', {
        url: '/settings/workspace-params',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-params.html',
        controller: 'WorkspaceParamCtrl'
    })

    .state('settings-workspace-users-create', {
        url: '/users/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users-create.html',
        controller: 'WorkspaceUserCreateCtrl'
    })
    .state('settings-workspace-users-edit', {
        url: '/users/{userId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users-edit.html',
        controller: 'WorkspaceUserEditCtrl'
    })

    .state('settings-workspace-users-assign', {
        url: '/settings/workspace-users/{userId}/assign',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/workspace-users-assign.html',
        controller: 'WorkspaceUserAssignCtrl'
    })
    .state('settings-extension-codes', {

        url: '/settings/extension-codes',
        parent: 'dashboard',
        templateUrl: 'views/pages/settings/extension-codes.html',
        controller: 'ExtensionCodesCtrl'
    })
    .state('settings-geo-permission', {
      url: '/settings/geo-permission',
      parent: 'dashboard',
      templateUrl: 'views/pages/settings/geo-permission.html',
      controller: 'GeoPermissionCtrl'
    })
    .state('files', {

        url: '/files',
        parent: 'dashboard',
        templateUrl: 'views/pages/files.html',
        controller: 'FilesCtrl'
    })
    .state('phones', {
        url: '/phones',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones.html',
        controller: 'phonesCtrl',
    })
    .state('phones-phones', {
        url: '/provision/phones?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/phones.html',
        controller: 'PhonesCtrl',
        params:  listPageParams
    })

    .state('phones-phone-create', {
        url: '/provision/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/phones-create.html',
        controller: 'PhoneCreateCtrl'
    })
    .state('phones-phone-edit', {
        url: '/provision/{phoneId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/phones-edit.html',
        controller: 'PhoneEditCtrl'
    })

    .state('phones-groups', {
        url: '/provision/groups?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/groups.html',
        controller: 'PhoneGroupsCtrl',
        params:  listPageParams
    })
    .state('phones-groups-create', {
        url: '/provision/groups/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/groups-create.html',
        controller: 'PhoneGroupsCreateCtrl'
    })
    .state('phones-groups-edit', {
        url: '/provision/groups/{phoneGroupId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/groups-edit.html',
        controller: 'PhoneGroupsEditCtrl'
    })
    .state('phones-global-settings', {
        url: '/provision/global-settings',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/global-settings.html',
        controller: 'PhoneGlobalSettingsCtrl'
    })
    .state('phones-global-settings-create', {
        url: '/provision/global-settings/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/global-settings-create.html',
        controller: 'PhoneGlobalSettingsCreateCtrl'
    })
    .state('phones-global-settings-modify', {
        url: '/provision/global-settings/{phoneSettingId}/modify',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/global-settings-modify.html',
        controller: 'PhoneGlobalSettingsModifyCtrl'
    })

    .state('phones-global-settings-modify-category', {
        url: '/provision/global-settings/{phoneSettingId}/modify/{categoryId}',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/global-settings-modify-category.html',
        controller: 'PhoneGlobalSettingsModifyCategoryCtrl'
    })
    .state('phones-individual-settings', {
        url: '/provision/individual-settings',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/individual-settings.html',
        controller: 'PhoneIndividualSettingsCtrl'
    })
    .state('phones-individual-settings-modify', {
        url: '/provision/individual-settings/{phoneSettingId}/modify',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/individual-settings-modify.html',
        controller: 'PhoneIndividualSettingsModifyCtrl'
    })


    .state('phones-individual-settings-modify-category', {
        url: '/provision/individual-settings/{phoneSettingId}/modify/{categoryId}',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/individual-settings-modify-category.html',
        controller: 'PhoneIndividualSettingsModifyCategoryCtrl'
    })
    .state('phones-deploy-config', {
        url: '/provision/deploy',
        parent: 'dashboard',
        templateUrl: 'views/pages/phones/deploy.html',
        controller: 'PhoneDeployCtrl'
    })

    .state('byo-carriers', {
        url: '/byo/carriers?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/byo/carriers.html',
        controller: 'BYOCarriersCtrl',
        params:  listPageParams
    })
    .state('byo-carrier-create', {
        url: '/byo/carrier/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/byo/carrier-create.html',
        controller: 'BYOCarrierCreateCtrl'
    })
    .state('byo-carrier-edit', {
        url: '/byo/carrier/{carrierId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/byo/carrier-edit.html',
        controller: 'BYOCarrierEditCtrl'
    })
     .state('byo-did-numbers', {
        url: '/byo/did-numbers?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/byo/dids.html',
        controller: 'BYODIDNumbersCtrl',
        params:  listPageParams
    })
     .state('byo-did-number-create', {
        url: '/byo/did-number/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/byo/did-create.html',
        controller: 'BYODIDNumberCreateCtrl'
    })
     .state('byo-did-number-edit', {
        url: '/byo/did-number/{numberId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/byo/did-edit.html',
        controller: 'BYODIDNumberEditCtrl'
    })
    .state('hosted-trunks', {
        url: '/hosted-trunks/?page&search',
        parent: 'dashboard',
        templateUrl: 'views/pages/trunks/trunks.html',
        controller: 'HostedTrunksCtrl',
        params:  listPageParams
    })
    .state('hosted-trunks-create', {
        url: '/hosted-trunks/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/trunks/trunk-create.html',
        controller: 'HostedTrunksCreateCtrl'
    })
    .state('hosted-trunks-edit', {
        url: '/hosted-trunks/{trunkId}/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/trunks/trunk-edit.html',
        controller: 'HostedTrunksEditCtrl'
    })



    .state('blank', {
        url: '/blank',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/blank.html',
    })
}).run(function($rootScope, $shared, $state, Backend, Authenticator, $window) {
    $rootScope.shared = $shared;
    $rootScope.$watch('shared.title', function(newTitle, oldTitle) {
        document.title = newTitle;
    });
      //Idle.watch();
    $rootScope.$on('IdleStart', function() {
        /* Display modal warning or sth */
    });
    $rootScope.$on('IdleTimeout', function() {
        /* Logout user */
        $shared.doLogout();
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        // do something
        console.log("state is changing ", arguments);

        // Backend.applyTheme();
        if(toState.requireAuthentication) {
          if(!Authenticator.isAuthenticated() || !Authenticator.checkAuthenticationTime()) {
            $state.go('login');
            localStorage.clear();
          } else {
            Authenticator.resetLastAuthenticationTime();
          }
        }
        $shared.state = toState;
        if (fromState.name === 'flow-editor') {
            $shared.showNavbar();
        }
        var token = localStorage.getItem("AUTH");
        var admin = localStorage.getItem("ADMIN_TOKEN");
        var workspaceId = getWorkspaceID();
        if ( admin ) {
            Backend.get("/admin/getWorkspaces").then(function(res) {
                $shared.workspaces = res.data.data;
                $shared.isAdmin = true;
                if (!workspaceId) {
                    $shared.selectedAdminWorkspace = $shared.workspaces[ 0 ];
                    $shared.changeAdminWorkspace2( $shared.workspaces[ 0 ] );
                    return;
                }
                angular.forEach($shared.workspaces, function( workspace ) {
                    console.log("checking workspace ", workspace);
                    if ( workspace.id === workspaceId ) {
                        console.log("switching to workspace ", workspace);
                        $shared.selectedAdminWorkspace= workspace;
                        $shared.changeAdminWorkspace2( workspace );
                    }
                });

            });
        }
        if ((!$shared.billInfo || !$shared.userInfo || !$shared.planInfo) && token) {
            Backend.refreshWorkspaceData().then(function(res) {
                console.log("updated UI data");
            });
        }
        /*
		Backend.get("/getBillingInfo").then(function(res) {
            $shared.billInfo = res.data;
        });
        */
    })
    $rootScope.$on('$stateChangeError', function(event) {
        console.log("no page found - 404");
        $state.go('404');
     });
     // get settings & customizations

     console.log("getting all settings...")
     $shared.isLoading = true;
    Backend.get("/getAllSettings").then(function(res) {
            console.log('state is currently', $state.current.name);
            var data = res.data;
                $shared.customizations = data['customizations'];
                $shared.frontend_api_creds = data['frontend_api_creds'];
                $shared.available_themes = data['available_themes'];
            console.log('customizations are ', $shared.customizations);
          addSocialLoginScript();
          addAnalyticsScript();
          addPaymentScript();
    });
    Backend.get("/getBillingCountries").then((res) => {
        $shared.billingCountries = res.data;
        applyDefaultTheme();
    });

    function applyDefaultTheme() {
      const defaultTheme = $shared.available_themes && $shared.available_themes.length && $shared.available_themes.find((theme) => theme.is_default);
      if (!$window.localStorage.THEME && defaultTheme) {
        $window.localStorage.setItem('THEME', defaultTheme.name);
      }
    }

    function addAnalyticsScript() {
      if ($shared.customizations.analytics_sdk === 'google') {
        document.head.innerHTML += $shared.frontend_api_creds.google_analytics_script_tag;
      } else if ($shared.customizations.analytics_sdk === 'matomo') {
        document.head.innerHTML += $shared.frontend_api_creds.matomo_script_tag;
      }
    }

    function addSocialLoginScript() {

      //0 - add microsoft script
      if ($shared.customizations.enable_msft_signin) addScript('https://alcdn.msauth.net/browser/2.17.0/js/msal-browser.min.js');

      //1 - add apple script
      if ($shared.customizations.enable_apple_signin) {
        addScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js');
        setTimeout(function() {
          appleSignInInit();
        }, 1000)
      }

      //2 - add google script
      if ($shared.customizations.enable_google_signin) addScript('https://apis.google.com/js/platform.js');
    }

    function addPaymentScript() {
      // if ($shared.customizations.enable_paypal_signin) addScript('https://www.paypal.com/sdk/js?client-id=' + $shared.frontend_api_creds.paypal_client_id + '&components=buttons');
      addScript('https://www.paypal.com/sdk/js?client-id=AUflBHBWaadLlcLUEG5H513ix02TfejudnE-9Lx6ZZ8r0IIa0tU1MHeUlBQHfIR1L0_IV0yePltwqYg3&disable-funding=credit,card&components=buttons');
    }

    function appleSignInInit() {
      if ($shared.frontend_api_creds.apple_signin_client_id) {
        AppleID.auth.init({
          clientId: $shared.frontend_api_creds.apple_signin_client_id,
          scope: 'email',
          redirectURI: DEPLOYMENT_DOMAIN,
          usePopup: true, // Optional parameter to open the sign-in window as a popup
        });
      }
    }
}).service('Authenticator', function($window, $q, $shared, $state, $rootScope) {
   var lastAuthenticationTime;
   this.isAuthenticated = function() {
        const authObject = JSON.parse($window.localStorage.AUTH || '');
        if (!authObject) return false;
        if (!authObject.token.expire_in_timestamp) return false;
        return Date.now() < authObject.token.expire_in_timestamp * 1000;
   };
   this.checkAuthenticationTime = function() {
      var currentTime = new Date().getTime();
      var timeSinceLastAuthentication = currentTime - lastAuthenticationTime;
      return timeSinceLastAuthentication < 30 * 60 * 1000;
   };
   this.setLastAuthenticationTime = function() {
      lastAuthenticationTime = new Date().getTime();
   };
   this.resetLastAuthenticationTime = function() {
      lastAuthenticationTime = null;
   };
   this.authenticate = function(username, password) {
    return Backend.post("/authenticate", {username: username, password: password}).then(function(res) {
      if(res.data.token){
        $window.sessionStorage.token =  res.data.token;
        this.setLastAuthenticationTime();
        return $q.resolve(res);
      } else {
        return $q.reject(res);
      }
    });
   };
}).service('ThemeService', function($window) {
  this.setTheme = function(theme) {
    $window.localStorage.setItem('THEME', theme);
  };
  this.getTheme = function() {
    return $window.localStorage.getItem('THEME') || 'default';
  };

  function addStyleToDOM(path) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('data-theme', '1');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  }
  this.addStyle = function(path) {
    if (!path) return;

    console.log('add style ', path);
    // remove existing theme
    const currentLink = document.head.querySelector('link[data-theme]');

    if (currentLink && currentLink.getAttribute('href') !== path) {
        currentLink.remove();
        addStyleToDOM(path);
    } else if (!currentLink) {
        addStyleToDOM(path);
    }
  }

  this.removeStyle = function(selectedPath) {
    const allLinks = ['styles/app-grey.css', 'styles/app-blue.css', 'styles/app-green.css', 'styles/app-red.css', 'styles/app-purple.css', 'styles/app-cyan.css' ]
    const links = document.head.querySelectorAll('link[href]');
    for (var i = 0; i < links.length; i++) {
      const path = links[i].getAttribute('href');
      if (!allLinks.includes(path)) continue;
      if (path === selectedPath) continue;
      document.head.removeChild(links[i]);
    }
  }
});


