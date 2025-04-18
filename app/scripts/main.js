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



  function SetupDialogController($scope, $shared, Backend, title, category, $mdDialog, onSuccess, onError) {
        $scope.values = {
      name: title,
      category: category
    };
    $scope.templates = [];
    $scope.step = 1;
    $scope.blankTemplate = {
      "title": "Blank Template",
      "id": null
    };
    $scope.templates = [];

    $scope.canShowPreset = function(preset) {
      var show = false;
      var presets = $scope.presets;
      if (preset.depends_on_field !== '') {
        for ( var index in presets ) {
          var obj = presets[ index ];
          if ( preset.depends_on_field === obj.var_name ) {
            if (obj.value === preset.depends_on_value ) {
              show = true;
            }
          }
        }
      } else {
        show = true;
      }
      return show;
    }
    $scope.cancel = function() {
      $mdDialog.hide();
    }



    function init() {
      $shared.isLoading = true;
      var templateByCategory;
      Backend.get("/flow/listTemplates").then(function (res) {
        $shared.isLoading = false;
        console.log("flow templates are ", res.data);
        var templates = res.data.data;
        $scope.templates = templates;
        var templatesByCategory = [];
        for ( var index in templates ) {
          var template = templates[ index ];
          var category = templatesByCategory[ template.category ];
          var found = false;
          for (var index1 in templatesByCategory ) {
              if (templatesByCategory[index1].name === template.category) {
                found = true;
                templateByCategory = templatesByCategory[index1];
              }
          }
          if ( !found ) {
            templatesByCategory.push({
              "name": template.category,
              "templates": [template]
            });
            continue;
          }
          templateByCategory['templates'].push( template );
        }
        $scope.templatesByCategory = templatesByCategory;
        console.log("template ", templatesByCategory);
      });

    }
    $scope.save = function() {
      if ( $scope.step === 1 ) {
        $scope.saveStep1();
      } else if ( $scope.step === 2 ) {
        $scope.saveStep2();
      }
    }
    $scope.saveStep1 = function () {
      var data = angular.copy($scope.values);
      var templateByCategory;
      data['flow_json'] = null;
      data['template_id'] = null;
      data['started'] = true;
      data['category'] = $scope.values['category'];
      if ($scope.selectedTemplate.name !== 'Blank') {
        data['template_id'] = $scope.selectedTemplate.id;
      }
      $shared.isCreateLoading = true;
      Backend.post("/flow", data).then(function (res) {
        $shared.isCreateLoading = false;
        console.log("response arguments ", arguments);
        console.log("response headers ", res.headers('X-Flow-ID'));
        console.log("response body ", res.body);
        var id = res.headers('X-Flow-ID');
        $scope.flowId = id;
        var urlObj = URI(document.location.href);
        var query = urlObj.query(true);
        var token = query.auth;

        Backend.get("/getFlowPresets?templateId=" + data['template_id']).then(function (res) {
          if ( !res.data.has_presets ) {
            return;
          } 
          var url = "/getFlowPresets?templateId=" + data['template_id'];
          $scope.inputs = {};
          Backend.get(url).then(function (res) {
            console.log("presets are ", res.data);
            $scope.presets = res.data.presets;
            angular.forEach($scope.presets, function(preset) {
              preset.value = preset.default;
            });
            $scope.step = 2;
          });
        });

      });
    }
    $scope.useTemplate = function (template) {
      $scope.selectedTemplate = template;
    };
    $scope.isSelected = function (template) {
      if ($scope.selectedTemplate && template.id === $scope.selectedTemplate.id) {
        return true;
      }
      return false;
    }

    $scope.saveStep2 = function() {
        var url = "/saveUpdatedPresets?templateId=" + $scope.selectedTemplate.id + "&flowId=" + $scope.flowId;
        var presets = angular.copy( $scope.presets );

        var data = presets.map(function(preset) {
          return {
            widget: preset.widget,
            widget_key: preset.widget_key,
            value: preset.value
          };
        });

        $shared.isLoading = true;
        Backend.post(url, data).then(function (res) {
          console.log("updated presets..");
          onSuccess($scope.flowId);
        });
    }

    init();

  }

  function SetupExtDialogController($scope, $shared, Backend, $mdDialog, onSuccess, onError) {
    $scope.values = {
    };

    $scope.$on("Created", function(data, id) {
      console.log("setup created fired.." , arguments);
      $shared.endIsLoading();
      $shared.endIsCreateLoading();
      onSuccess(id);
    });

  }
  function SetupNumberDialogController($scope, $shared, Backend, $mdDialog, onSuccess, onError) {
    $scope.values = {
    };

    $scope.$on("Created", function(data, id) {
      console.log("setup created fired.." , arguments);
      $shared.endIsLoading();
      $shared.endIsCreateLoading();
      onSuccess(id);
    });

  }
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYOCarrierCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared ) {
	  $shared.updateTitle("Create Carrier");
  $scope.values = {
    name: "",
    ip_address: "",
    routes: [],
    auths: [],
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting carrier form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['name'] = $scope.values.name;
      values['ip_address'] = $scope.values.ip_address;
      values['routes'] = $scope.values.routes;
      values['auths'] = $scope.values.auths;
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
      $shared.isCreateLoading = true;
      Backend.post("/byo/carrier", values).then(function() {
       console.log("updated carrier..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created carrier')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('byo-carriers', {});
        $shared.endIsCreateLoading();
      });
    }
  }
   $scope.addRoute = function() {
     console.log("addRoute called..");
    var copy = {
      "prefix": "",
      "prepend": "",
      "match": ""
    };
    $scope.values.routes.push(copy);
  }
   $scope.addAuth= function() {
     console.log("addAuth called..");
    var copy = {
      "ip": "",
      "range": "/32"
    };
    $scope.values.auths.push(copy);
  }
  $scope.removeRoute = function($index, route) {
    $scope.values.routes.splice($index, 1);
  }
  $scope.removeAuth = function($index, auth) {
    $scope.values.auths.splice($index, 1);
  }

  $shared.endIsLoading();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYOCarrierEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit Carrier");
  $scope.flows = [];
  $scope.carrier = null;
  $scope.submit = function(carrier) {
    var params = {};
    params['name'] = $scope.carrier.name;
    params['ip_address'] = $scope.carrier.ip_address;
    params['routes'] = $scope.carrier.routes;
    params['auths'] = $scope.carrier.auths;
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
      $shared.isCreateLoading = true;
    Backend.post("/byo/carrier/" + $stateParams['carrierId'], params).then(function() {
        console.log("updated carrier..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Carrier updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('byo-carriers', {});
      $shared.endIsCreateLoading();
    });
  }
   $scope.addRoute = function() {
    var copy = {
      "prefix": "",
      "prepend": "",
      "match": ""
    };
    $scope.carrier.routes.push(copy);
  }
   $scope.addAuth= function() {
     console.log("addAuth called..");
    var copy = {
      "ip": "",
      "range": "/32"
    };
    $scope.carrier.auths.push(copy);
  }
  $scope.removeAuth = function($index, auth) {
    $scope.carrier.auths.splice($index, 1);
  }
  $scope.removeRoute = function($index, route) {
    $scope.carrier.routes.splice($index, 1);
  }

  $shared.isLoading = true;
  Backend.get("/byo/carrier/" + $stateParams['carrierId']).then(function(res) {
    $scope.carrier = res.data;
    $shared.endIsLoading();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYOCarriersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Carriers");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.carriers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/byo/carrier/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'carriers' );
      pagination.loadData().then(function(res) {
      $scope.carriers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.editCarrier = function(carrier) {

    $state.go('byo-carrier-edit', {carrierId: carrier.public_id});
  }
  $scope.createCarrier = function(carrier) {

    $state.go('byo-carrier-create');
  }
  $scope.deleteCarrier = function($event, carrier) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this carrier?')
          .textContent('you will not be able to use this carrier any longer')
          .ariaLabel('Delete')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/byo/carrier/" + carrier.public_id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYODIDNumberCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
	  $shared.updateTitle("Create DIDNumber");
  $scope.values = {
    username: "",
    secret: "",
    tags: [],
    flow_id: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting number form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['number'] = $scope.values.number;
      values['flow_id'] = $scope.values.flow_id;
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
      $shared.isCreateLoading = true;
      Backend.post("/byo/did", values).then(function() {
       console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created carrier')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('byo-did-numbers', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $q.all([
    Backend.get("/flow/list?all=1"),
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $shared.endIsLoading();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYODIDNumberEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit DID Number");
  $scope.flows = [];
  $scope.number = null;
  $scope.submit = function(number) {
    var params = {};
    params['number'] = $scope.number.number;
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
      $shared.isCreateLoading = true;
    Backend.post("/byo/did/" + $stateParams['numberId'], params).then(function() {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('DIDNumber updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('byo-did-numbers', {});
      $shared.endIsCreateLoading();
    });
  }
  $scope.changeFlow = function(flow) {
    $scope.number.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $shared.isLoading = true;
  $q.all([
    Backend.get("/flow/list?all=1"),
    Backend.get("/byo/did/" + $stateParams['numberId'])
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $scope.number = res[1].data;
    $shared.endIsLoading();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BYODIDNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My DIDNumbers");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.numbers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/byo/did/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }

  $scope.importNumbers = function($event) {
    console.log("importNumbers called..");
    $mdDialog.show({
      controller: DialogImportController,
      templateUrl: 'views/dialogs/import-byo-numbers.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onAdded: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });

  }
  $scope.createNumber = function() {

    $state.go('byo-did-number-create');
  }
  $scope.editNumber = function(number) {

    $state.go('byo-did-number-edit', {numberId: number.public_id});
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this DID number?')
          .textContent('If you delete this carrier you will not be able to call it anymore')
          .ariaLabel('Delete')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/byo/did/" + number.public_id).then(function() {
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

    function DialogImportController($scope, $mdDialog, Backend, $shared, onAdded) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        number: ""
      };
      $scope.submit= function($event) {
        var params = new FormData();
      params.append("file", angular.element("#uploadFile").prop("files")[0]);
      $shared.isLoading = true;
    Backend.postFiles("/byo/did/import", params, true).then(function () {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
          .textContent('Imported numbers..')
          .position("top right")
          .hideDelay(3000)
        );
        $mdDialog.hide(); 
        $shared.endIsLoading();
        onAdded();
      }, function() {
        $shared.endIsLoading();
      });
      }
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window, $stateParams) {
	var stripeElements;
	var stripeCard;
	var stripe;
	// var explicitPlan  = $stateParams['frm'];
	if($stateParams['frm'] === 'PS'){
		$scope.selectedIndex = 1;
	}
	$shared.updateTitle("Billing");
	  $scope.$shared = $shared;
	  $scope.triedSubmit = false;
	  $scope.isTabLoaded = false;
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

  async function initializePaymentGateway() {
    return new Promise(async (resolve, reject) => {
      switch ($shared.customizations.payment_gateway) {
        case 'stripe': {
			console.log('initializing stripe client');
          //Stripe.setPublishableKey($shared.frontend_api_creds.stripe_pub_key);
		  $scope.stripe = Stripe($shared.frontend_api_creds.stripe_pub_key);
          resolve();
        }
        default: {
          reject();
        }
      }
    });
  }
		function submitBilling(cardId, amount) {
			var data = {};
			data['card_id'] = cardId;
			data['amount'] =  amount;
			$scope.data.creditAmount.value;
			$shared.isCreateLoading =true;
			Backend.post("/credit/", data).then(function(res) {
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

		function createCardResource(paymentMethod) {
			return $q(function(resolve, reject) {
				var data = {};
				//data['card_token'] = response.id;
				//data['stripe_card'] = response.card.id;
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

		// function setupStripeElements() {
		// 	console.log('setupStripeElements called');
		// 	// Create an instance of Elements.
		// 	stripeElements = stripe.elements();

		// 	// Custom styling can be passed to options when creating an Element.
		// 	var style = {
		// 		base: {
		// 			color: '#ffffff', // Set font color to white
		// 			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
		// 			fontSmoothing: 'antialiased',
		// 			fontSize: '16px',
		// 			'::placeholder': {
		// 				color: '#aab7c4'
		// 			}
		// 		},
		// 		invalid: {
		// 			color: '#fa755a',
		// 			iconColor: '#fa755a'
		// 		}
		// 	};

		// 	// Create an instance of the card Element.
		// 	stripeCard = stripeElements.create('card', {style: style});

		// 	// Add an instance of the card Element into the `card-element` <div>.
		// 	stripeCard.mount('#card-element');

		// 	// Handle real-time validation errors from the card Element.
		// 	stripeCard.on('change', function(event) {
		// 		if (event.error) {
		// 			// Show the errors on the form
		// 			$scope.errorMsg = event.error.message;
		// 			//angular.element('.add-card-form').scrollTop(0)
		// 		} else {
		// 			$scope.errorMsg = null;
		// 		}
		// 	});
		// }

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

		$scope.cancel = function() {
			$mdDialog.cancel();
		}
		// $scope.submit = function() {
		// 	/*
		// 	var data = {};
		// 	data['number'] = $scope.card.number;
		// 	data['cvc'] = $scope.card.cvv;
		// 	var splitted = $scope.card.expires.split("/");
		// 	data['exp_month'] = splitted[ 0 ];
		// 	data['exp_year'] = splitted[ 1 ];
		// 	data['address_zip'] = $scope.card.postal_code;
		// 	Stripe.card.createToken(data, stripeResponseHandler);
		// 	*/
		// 	console.log('submit add card form');
		// 	createPaymentMethod().then(function(paymentMethod) {
		// 		console.log('created payment method ', paymentMethod)
		// 		// Get the token ID:
		// 		$mdDialog.hide();
		// 		onSuccess(paymentMethod);
		// 	}).catch(function(error) {
		// 		// Show the errors on the form
		// 		$scope.errorMsg = error;
		// 		angular.element('.add-card-form').scrollTop(0)
		// 	});
		// }

		// setTimeout(() => {
		// 	waitForElement('#cardNumber').then(function() {
		// 		stripe = Stripe($shared.frontend_api_creds.stripe_pub_key);
		// 		setupStripeElements();
		// 	});
		// }, 0);

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
						console.log(res);
						$mdDialog.hide();
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
			createCardResource(response).then(function() {
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
	$scope.makePayment = function($event) {
		console.log('$scope.makePayment called');
    	$state.go('billing-make-payment', {});
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
					createCardResource(response).then(function(res) {
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
		return 	Backend.get("/getBillingHistory?startDate=" + formatDate($scope.startDate) + "&endDate=" + formatDate($scope.endDate));
	}
	
	$scope.changeStartDate = function() {
		console.log('changeStartDate', arguments);
		console.log('start date ', $scope.startDate);
		$scope.startDate = angular.element('#startDate').val();
	}

	$scope.changeEndDate = function() {
		console.log('changeEndDate', arguments);
		console.log('end date ', $scope.endDate);
		$scope.endDate = angular.element('#endDate').val();
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
		$window.location.replace(createUrl("/downloadBillingHistory?startDate=" + formatDate($scope.startDate) + "&endDate=" + formatDate($scope.endDate) + "&auth=" + token.token.auth));
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

				initializePaymentGateway().then(function() {
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
				});
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
	$scope.setPrimary = function(card)
	{
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
		// Backend.delete("/card/" + card.id).then(function() {
		// 	loadData(true).then(function() {
		// 		$mdToast.show(
		// 			$mdToast.simple()
		// 			.textContent('Removed card successfully..')
		// 			.position("top right")
		// 			.hideDelay(3000)
		// 		);
		// 	});
		// });
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

	loadData(false);
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingFixPaypalAgreementCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade");
	  $scope.$shared = $shared;
    $scope.plans = '';

    // TODO implement this
    $scope.createNewAgreement = function(plan) {
      return true;
    }

    Backend.get("/getServicePlans").then(function(res) {
      console.log("getServicePlans ", res.data);
      $scope.plans = res.data;
    });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingUpgradeCompleteCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $stateParams, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade Complete");
	  $scope.plan = null;
	  $scope.gotoDashboard = function() {
		  $state.go('dashboard');
	  }
		Backend.refreshWorkspaceData().then(function(res) {
				console.log("updated info");
						$mdToast.show(
						$mdToast.simple()
							.textContent('Plan upgraded')
							.position('top right')
							.hideDelay(3000)
						);
				$scope.plan = res.data[ 4 ];
				$shared.setWorkspace(res.data[ 5 ]);
					$shared.endIsCreateLoading();
            });

  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('BillingUpgradePlanCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Billing Upgrade");
	  $scope.$shared = $shared;
    $scope.plans = '';

    $scope.canUpgrade = function(plan) {
      const info = $shared.planInfo;
      const currentRank = $scope.plans.find((plan) => plan.key_name === info.key_name).rank;
      if (plan.rank >= currentRank) return false;
      return true;
    }

    $scope.upgradePlan =  function(plan) {
      $state.go('billing-upgrade-submit', {"plan": plan});
    }

    Backend.get("/getServicePlans").then(function(res) {
      console.log("getServicePlans ", res.data);
      $scope.plans = res.data;
    });
});


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

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BlockedNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $http ) {
    $shared.updateTitle("Blocked Numbers");
    $scope.Backend = Backend;
    function DialogController($scope, $mdDialog, Backend, $shared, onCreated) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.countryCode = '';
      $scope.data = {
        number: "",
        notes: ""
      };
      $scope.searchCountry = '';
      $http.get('../../scripts/constants/country-list.json').then(function(countries) {
        $scope.countries = countries.data;
      });

      $scope.onNumberChange = function() {
        $scope.data.number = Number($scope.data.number.replace(/[^0-9]/g, '').slice(0, 10));
        if (!$scope.data.number) $scope.data.number = '';
      }

      $scope.getMatchedCountry = function(text) {
        console.log('text', text);
        if (!text) return;
        const matchedCountry = $scope.countries.filter(country => country.name.toLowerCase().includes(text.toLowerCase()));
        console.log('matchedCountry', matchedCountry);
        return matchedCountry;
      }
      $scope.submit= function() {
        const data = angular.copy($scope.data);
        data.number = $scope.countryCode + data.number;
        Backend.post("/settings/blockedNumbers", data).then(function(res) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Number added to blocked callers list successfully.')
            .position("top right")
            .hideDelay(3000)
        );
            $scope.close();
            onCreated();
        });
      }

      $scope.close = function() {
        $mdDialog.hide();
      }
    }


    function ImportDialogController($scope, $mdDialog, Backend, $shared, onCreated, onFinished) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        file: null
      };
      $scope.submit = function($event) {
        var files = angular.element("#uploadFile").prop("files");
        if ( files.length === 0 ) {
          $scope.errorText="Please select atleast 1 file..";
          return;
        }
        var params = new FormData();
        angular.forEach(files, function(file) {
          params.append("file[]", file);
        });
        $shared.isCreateLoading = true;
        Backend.postFiles("/settings/blockedNumbers/uploadList", params, true).then(function(res) {
          var data = res.data;
          $shared.endIsCreateLoading();
          if (data.amountFailed > 0) {
              angular.forEach(data.results, function(result) {
                if ( !result.success ) {
                  var msg = result.name + " failed to upload please check the file type and size";
                  $shared.showToast( msg );
                }
              });
            }
            $mdDialog.hide();
            onFinished();
        });
      }
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.numbers = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/settings/blockedNumbers/list").then(function(res) {
          $scope.numbers = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.createNumber = function($event) {
    console.log('createNumber',  $scope.countries);
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/add-blocked-number.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onCreated: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('This will permantely remove the number from your blocked list')
          .ariaLabel('Delete extension')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/settings/blockedNumbers/" + number.public_id).then(function() {
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

  $scope.import= function($event) {
    const data = angular.copy($scope.data);
    console.log('import',  $scope.countries);
    $mdDialog.show({
      controller: ImportDialogController,
      templateUrl: 'views/dialogs/blocked-numbers-import.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onCreated: function() {
          $scope.load();
        },
        onFinished: function() {
          $scope.load();
        },


      }
    })
    .then(function() {
    }, function() {
    });
  }

  $scope.load();
});


'use strict';
/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BuyNumbersCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, $stateParams) {
  $shared.updateTitle("Buy Numbers");
  $scope.countries = [];
  $scope.state = "SEARCHING";
  $scope.inDialog = false;
  $scope.rcSearch = {
    isDisabled: false,
    noCache: true,
    selectedItem: null,
  };
  $scope.rcFaxSearch = {
    isDisabled: false,
    noCache: true,
    selectedItem: null,
  };

  function DialogController($scope, inDialog, onSuccess, onError, $mdDialog, number) {
    $scope.number = number;
    $scope.cancel = function () {
      $mdDialog.cancel();

    };
    $scope.gotoSettings = function () {
      $mdDialog.hide("");
      $state.go('my-numbers-edit', {
        numberId: number.public_id
      });
    }
  }

  $scope.settings = {
    country: "",
    region: "",
    pattern: "",
    rate_center: "",
    showMoreOptions: false,
    number_for: "",
    number_type: "local",
    vanity_prefix: "8**",
    vanity_pattern: ""
  };
  $scope.numbers = [];
  $scope.didFetch = false;
  console.log("state params are ", $stateParams);
  if ($stateParams['type']) {
    $scope.settings.number_for = $stateParams['type'];
  }

  function purchaseConfirm(ev, number) {
    if ($scope.inDialog) {
      var confirm = window.confirm("Are you sure ?");
      if (confirm) {
        $scope.$emit("Created", id)
        onSuccess(id);
        return;
      }
      return;
    }
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/dialogs/purchase-did-confirm.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        skipHide: true,
        fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        locals: {
          "number": number,
          "inDialog": $scope.inDialog,
          "onSuccess": function (id) {
            $scope.$emit("Created", id)
          },
          "onError": function () {
            $shared.showError("Purchase Error");
          }
        }
      })
      .then(function () {}, function () {});
  };

  $scope.load = function () {
    $scope.listCountries().then(function () {
      $shared.endIsLoading();
    });
  }
  $scope.fetch = function (event, didForm) {
    $scope.triedSubmit = true;
    if (!didForm.$valid) {
      return;
    }
    var data = {};
    //data['region'] = $scope.settings['region'];
    data['region'] = $scope.settings['region']['code'];
    if ($scope.settings.showMoreOptions) {
      data['rate_center'] = $scope.settings['rate_center'];
    }

    data['prefix'] = $scope.settings['pattern'];
    //data['prefix'] = "";
    data['country_iso'] = $scope.settings['country']['iso'];
    data['number_for'] = $scope.settings['number_for'];
    data['number_type'] = $scope.settings['number_type'];
    data['vanity_prefix'] = $scope.settings['vanity_prefix'];
    data['vanity_pattern'] = $scope.settings['vanity_pattern'];
    $shared.isCreateLoading = true;
    Backend.get("/did/availableNumbers", {
      "params": data
    }).then(function (res) {
      $scope.numbers = res.data;
      $scope.didFetch = true;
      $scope.state = "SEARCHED";
      $shared.endIsCreateLoading();
    });
  }

  $scope.confirmNumberTOS = function (number) {
    var confirm = $mdDialog.confirm()
      .title('Vanity Number Notice')
      .textContent("Please note that because this is a vanity number it won't be available right away. This number will be listed on your account after you buy it however it will not be available for use until our upstream carrier fulfills the request")
      .ariaLabel('Agree')
      .targetEvent($event)
      .ok('Please Continue')
      .cancel('Exit');


  }

  function buyVanityNumber($event, number) {
    var confirm = $mdDialog.confirm()
      .title('Vanity Number Notice')
      .textContent("Please note that because this is a vanity number it won't be available right away. This number will be listed on your account after you buy it however it will not be available for use until our upstream carrier fulfills the request")
      .ariaLabel('Agree')
      .targetEvent($event)
      .ok('Please Continue')
      .cancel('Exit');

    $mdDialog.show(confirm).then(function () {
      console.log("md dialog show result ", arguments);
      buyNumber($event, number);
    });
  }

  function completeBuy(number) {
    return $q(function(resolve, reject) {
      var params = {};
      params['api_number'] = number.api_number;
      params['number'] = number.number;
      params['region'] = number.region;
      params['monthly_cost'] = number.monthly_cost;
      params['setup_cost'] = number.setup_cost;
      params['provider'] = number.provider;
      params['country'] = number.country;
      params['features'] = number.features.join(",");
      params['type'] = number.type;
      $shared.isCreateLoading = true;
      Backend.post("/did", params).then(function (res) {
        if (!res.data.success) {
          $shared.showError("Purchase Error", res.data.message);
          return;
        }
        Backend.get("/did/" + res.headers("X-Number-ID")).then(function (res) {
          var number = res.data;
          $shared.endIsCreateLoading();
          resolve(number);
        });
      }, function (res) {
        console.log("res is: ", res);
        if (res.status === 400) {
          var data = res.data;
          $shared.showError("Error", data.message);
        }
      });
    });
  }

  function buyNumber($event, number) {
    console.log("dialog ", $scope.inDialog);
    if ($scope.inDialog) {
      var confirm = window.confirm("Are you sure ?");
      console.log("confirmed ", confirm);
      if (confirm) {
        completeBuy(number).then(function(didNumber) {
          $scope.$emit("Created", id)
        });
        return;
      }
      return;
    }
      $shared.scrollTop();
    var confirm = $mdDialog.confirm()
      .title('Are you sure you want to purchase number "' + number.number + '"?')
      .textContent('this number will cost you ' + number.setup_cost + ' to setup then it will cost you ' + number.monthly_cost + ' every month. ')
      .ariaLabel('Buy number')
      .targetEvent($event)
      .ok('Yes')
      .cancel('No');
    $mdDialog.show(confirm).then(function() {
      completeBuy(number).then(function(didNumber) {
          $shared.endIsCreateLoading();
          purchaseConfirm($event, didNumber);
      });
    });
  }
  $scope.buyNumber = function ($event, number) {
    $shared.scrollTop();
    // Appending dialog to document.body to cover sidenav in docs app
    if ($scope.settings.number_type === 'vanity') {
      buyVanityNumber($event, number);
      return;
    }
    buyNumber($event, number);
  }
  $scope.changeCountry = function (country) {
    console.log("changeCountry ", country);
    $scope.settings.country = country;
    $scope.regions = [];
    $scope.listRegions();
  }
  $scope.changeRegion = function (region) {
    console.log("changeRegion ", region);
    $scope.settings.region = region;
    $scope.listRateCenters();
  }
  $scope.changeRateCenter = function (rateCenter) {
    console.log("changeRateCenter ", rateCenter);
    $scope.settings.rate_center = rateCenter;
  }

  $scope.listCountries = function () {
    return $q(function (resolve, reject) {
      Backend.get("/getCountries").then(function (res) {
        console.log("got countries ", res.data);
        $scope.countries = res.data;
        resolve();
      });
    });

  }

  $scope.listRegions = function () {
    Backend.get("/getRegions?countryId=" + $scope.settings.country.id).then(function (res) {
      console.log("got regions ", res.data);
      $scope.regions = res.data;
    })

  }
  $scope.listRateCenters = function () {
    Backend.get("/getRateCenters?countryId=" + $scope.settings.country.id + "&regionId=" + $scope.settings.region.id).then(function (res) {
      console.log("got rate centers ", res.data);
      $scope.rateCenters = res.data;
    })

  }
  $scope.querySearch = function (query) {
    console.log("querySearch query is: " + query);
    var all = $scope.rateCenters;
    return $q(function (resolve, reject) {
      var regexp = new RegExp(".*" + query.toLowerCase() + ".*");
      var results = [];
      angular.forEach(all, function (item) {
        if (item.toLowerCase().match(query)) {
          results.push(item);
        }
      });
      return resolve(results);
    });
  }
  $scope.searchTextChange = function (text) {
    console.log("searchTextChange");
  }
  $scope.selectedItemChange = function (item) {
    console.log('rc Item changed to ' + JSON.stringify(item));
    $scope.settings['rate_center'] = item;
  }
  $scope.queryFaxSearch = function (query) {
    console.log("querySearch query is: " + query);
    var all = $scope.rateCenters;
    return $q(function (resolve, reject) {
      var regexp = new RegExp(".*" + query.toLowerCase() + ".*");
      var results = [];
      angular.forEach(all, function (item) {
        if (item.toLowerCase().match(query)) {
          results.push(item);
        }
      });
      return resolve(results);
    });
  }
  $scope.searchFaxTextChange = function (text) {
    console.log("searchTextChange");
  }
  $scope.selectedFaxItemChange = function (item) {
    console.log('rc Item changed to ' + JSON.stringify(item));
    $scope.settings['rate_center'] = item;
  }
  $scope.hideOptions = function () {
    $scope.settings.showMoreOptions = false;
  }
  $scope.showOptions = function () {
    $scope.settings.showMoreOptions = true;
  }
  $scope.buyVoiceNumbers = function () {
    //$scope.settings.number_for='voice';
    console.log("buy voice numbers");
    $state.go('buy-numbers-select', {
      type: "voice"
    });
  }
  $scope.buyFaxNumbers = function () {
    //$scope.settings.number_for='fax';
    $state.go('buy-numbers-select', {
      type: "fax"
    });
  }
  $scope.backToSearch = function () {
    $scope.state = "SEARCHING";
  }

  $scope.init = function (inDialog, type) {
    $scope.inDialog = inDialog;
    $scope.settings.number_for = type;
    console.log("init ", arguments);
  }

  $scope.load();
});

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CallViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, $shared, $mdToast) {
	  $shared.updateTitle("Call View");
  $scope.call = [];
  $scope.load = function() {
    $shared.isLoading =true;
    Backend.get("/call/" + $stateParams['callId']).then(function(res) {
      console.log("call is ", res.data);
      $shared.isLoading =false;
      var call = res.data;
      call.recordings = call.recordings.map(function(obj) {
        //obj['uri'] = $sce.trustAsResourceUrl(obj['uri']);
        obj['public_url'] = $sce.trustAsResourceUrl(obj['s3_url']);
        return obj;
      });
      $scope.call = call;
    })
  }
  $scope.saveCall = function() {
    var data = {
      notes: $scope.call.notes
    };
    Backend.post("/call/" + $stateParams['callId'], data).then(function(res) {
      console.log("call is ", res.data);
        $mdToast.show(
          $mdToast.simple()
            .textContent('Call updated..')
            .position('top right')
            .hideDelay(3000)
        );
        $state.go('calls', {});
    })

  }
  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CallsCtrl', function ($scope, Backend, pagination, $location, $state, $stateParams, $mdDialog, $shared) {
    $shared.updateTitle("Calls");
    console.log("STATE PARAMS ", $stateParams);
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.$stateParams = $stateParams;
  $scope.settings = {
    page: 0
  };
  $scope.calls = [];
  $scope.$shared = $shared;
  $scope.load = function() {
      console.log('loading calls')
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/call/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'calls' );
      pagination.loadData().then(function(res) {
        console.log('call data ',res.data.data);
      $scope.calls = res.data.data;
      $shared.endIsLoading();
    })
  }
  $scope.viewCall= function(call) {
    $state.go('call-view', {callId: call.api_id});
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CancelSubscriptionCtrl', function ($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
  $shared.updateTitle("Cancel Subscription");
  $scope.cancelSubscription = false;
  $shared.endIsCreateLoading();
  $scope.cancelSubscription = function ($event) {
    $scope.cancelSubscription = true;
    const confirm = $mdDialog.confirm()
      .title('Are you sure you want to cancel your subscription?')
      .textContent('You will not be able to use Lineblocs until you subscribe again.')
      .ariaLabel('Cancel Subscription')
      .targetEvent($event)
      .ok('Confirm')
      .cancel('Dismiss');
    $mdDialog.show(confirm).then(function () {
      $shared.isCreateLoading = true;
      Backend.post("/billingDiscontinue").then(function (res) {
        $mdToast.show($mdToast.simple().textContent('Subscription cancelled').position("top right").hideDelay(3000));
        $scope.cancelSubscription = false;
        $shared.endIsCreateLoading();
      });
    });
  }
  $scope.goBilling = function() {
    $state.go('billing');
  }
});

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('CreatePortCtrl', function ($scope, $timeout, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
  $shared.updateTitle("Create Number");
  $scope.continue = false;
  $scope.flows = [];
  $scope.step = 1;
  $scope.fileName = "";
  $scope.selectedPortType = "Port single number";
  $scope.tab1FormFilled = false;
  $scope.number = {
    "first_name": "",
    "last_name": "",

    "city": "",
    "state": "",
    "zip": "",
    "country": "",
    "provider": "",
    "number": "",
    "type_of_port": "Port single number",
    "address_line_1": "",
    "address_line_2": "",
  }
  $scope.files = {
    "noLOA": false,
    "noCSR": false,
    "noInvoice": false
  };

  $scope.tabChanged = function (tab) {
    $scope.selectedPortType = tab;
    console.log("tabChanged ", $scope.selectedPortType);
    // $scope.currentTab = tab;
  }

  $scope.uploadedFiles = {
    loa: null,
    csr: null,
    invoice: null
  }

  $scope.validatePrevForm = function () {
    $scope.step--;
    $scope.triedSubmit = false;
  };

  $scope.validateStepForm = function(form, step) {
    if (step > $scope.step && !form.$valid) {
      $scope.triedSubmit = true;
      return;
    }
    if (step > $scope.step + 1) return;
    $scope.triedSubmit = false;
    $scope.step = step;
  };


  $scope.openFileInput = function (id) {
    $timeout(function () {
      const fileInput = document.getElementById(id);
      fileInput.click();
      fileInput.addEventListener('change', function (event) {
        console.log('Selected file:', event);
        if (event.target.files.length > 0) {
          $scope.uploadedFiles[id] = event.target.files[0];
          $scope.$apply();
        }
      });
    });
  };

  $scope.clearFileInput = function (id) {
    $scope.uploadedFiles[id] = null;
  }

  $scope.continueToProcess = function () {
    $scope.continue = true;
  }

  function checkFile(id, key) {
    if (angular.element(id) && angular.element(id).prop("files").length === 0) {
      $scope.files[key] = true;
      return false;
    }
    $scope.files[key] = false;
    return true;
  }
  $scope.saveNumber = function (form) {
    console.log("Port single number ===>", $scope.selectedPortType)
    $scope.triedSubmit = true;
    $scope.tab1FormFilled = true;
    if (!checkFile("#loa", "noLOA")) {
      return;
    }
    if (!checkFile("#csr", "noCSR")) {
      return;
    }
    if (!checkFile("#invoice", "noInvoice")) {
      return;
    }

    if (!form.$valid) {
      return;
    }
    var params = new FormData();
    params.append("first_name", $scope.number['first_name']);
    params.append("last_name", $scope.number['last_name']);

    params.append("city", $scope.number['city']);
    params.append("state", $scope.number['state']);
    params.append("zip", $scope.number['zip']);
    params.append("country", $scope.number['country']['iso']);
    params.append("address_line_1", $scope.number['address_line_1']);
    params.append("address_line_2", $scope.number['address_line_2']);
    params.append("loa", $scope.uploadedFiles['loa']);
    params.append("csr", $scope.uploadedFiles['csr']);
    params.append("invoice", $scope.uploadedFiles['invoice']);

    params.append("type_of_port", $scope.selectedPortType);

    if ($scope.selectedPortType === 'Port single number') {
      params.append("provider", $scope.number['provider']);
      params.append("number", $scope.number['number']);
    } else {
      const numbers = $scope.number['number'].split('\n').filter(item => item);
      params.append("provider", $scope.number['provider']);
      params.append("numbers", JSON.stringify(numbers));
    }

    $shared.isLoading = true;
    var errorMsg = "One of the documents could not be uploaded please be sure to upload a file size less than 10MB and use one of the following file formats: pdf,doc,doc";
    Backend.postFiles("/port/", params, true).then(function () {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
          .textContent('Number port created..')
          .position("top right")
          .hideDelay(3000)
        );
        $state.go('ports', {});
      }, function() {
        $shared.endIsLoading();
      });
  }

  $scope.changeCountry = function (country) {
    console.log("changeCountry ", country);
    $scope.number.country = country;
    // $scope.number.address_line_1 = '';
    // $scope.number.address_line_2 = '';
    // $scope.number.city = '';
    // $scope.number.state = '';
    // $scope.number.zip = '';
  }

  $shared.endIsLoading();
});

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
 angular.module('Lineblocs').controller('DashboardRedirectCtrl', ['$scope', '$timeout', 'Backend', '$shared', '$q', '$state', function ($scope, $timeout, Backend, $shared, $q, $state) {
	  $shared.updateTitle("Dashboard");
		  var urlObj = URI(document.location.href.split("#")[1]);
          var query = urlObj.query(true);


          var token = query.auth;
		  var workspaceId = query.workspaceId;
		  console.log("in dashboard redirect");
		  Backend.post("/internalAppRedirect", {
			token: token,
			workspaceId: workspaceId

		  }).then(function(res) {
			  console.log("received reply ", res);
			var token =res.data;
			var workspace =res.data.workspace;
			$shared.setAuthToken(token);
			$shared.setWorkspace(workspace);
			$state.go('dashboard-user-welcome', {});
		  });
}]);
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
 angular.module('Lineblocs').controller('DashboardWelcomeCtrl', ['$scope', '$timeout', 'Backend', '$shared', '$q', 'ThemeService', function ($scope, $timeout, Backend, $shared, $q, ThemeService) {
	  $shared.updateTitle("Dashboard");
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
	function applyTheme(theme) {
        const themes = {
          default: 'styles/app-blue.css',
          dark: 'styles/app-grey.css'
        }
        if (theme !== ThemeService.getTheme()) {
          ThemeService.setTheme(theme);
        }

        ThemeService.addStyle(themes[theme]);
        ThemeService.removeStyle(themes[theme]);
    }
	$scope.load = function() {
		$timeout(function () {
			var color = Chart.helpers.color;
			$shared.isLoading = true;
			Backend.get("/dashboard").then(function(res) {
				var graph = res.data[0];
				$shared.billInfo=  res.data[1];
                $shared.userInfo=  res.data[2];
                $scope.checklist = res.data[3];
				console.log("graph data is ", graph);
				applyTheme($shared.userInfo.theme);
				$shared.isLoading = false;
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
    $scope.userAccountNotCompleted = function() {
        if (!$scope.checklist) {
            return true;
        }
        if (!$scope.checklist.created_account 
            || 
            !$scope.checklist.filled_personal_info 
            ||
            !$scope.checklist.registered_did
            ||
            !$scope.checklist.added_billing_info
        ) {
            return true
        }
        return false;
    }
	$scope.load();
	loadAddedResources1();	
}]);
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('DebuggerLogsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $shared, $q, $stateParams) {
    $shared.updateTitle("Debugger Logs");
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.$stateParams = $stateParams
  $scope.settings = {
    page: 0
  };
  $scope.logs = [];
  $scope.load = function() {
    $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/log/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'logs' );
      $q.all([
      Backend.get("/flow/list?all=1"),
      pagination.loadData()
      ]).then(function(res) {
        $scope.flows = res[0].data.data;
        $scope.logs = res[1].data.data;
        console.log("logs are ", $scope.logs);
      $shared.endIsLoading();
    })
  }
  $scope.viewLog= function(log) {
    $state.go('debugger-log-view', {logId: log.api_id});
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('EditPortCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
  $shared.updateTitle("Edit Port Number");
  $scope.flows = [];
  $scope.number = null;
  $scope.number = {
    "first_name": "",
    "last_name": "",

    "city": "",
    "state": "",
    "zip": "",
    "country": "",
    "provider": "",
    "number": "",
    "address_line_1": "",
    "address_line_2": "",
  }
  $scope.files = {
    "noLOA": false,
    "noCSR": false,
    "noInvoice": false
  };

  function checkFile(id, key) {
    if (angular.element(id).prop("files").length === 0) {
      return false;
    }
    return true;
  }
  $scope.saveNumber = function (form) {
    console.log("saveNumber");
    $scope.triedSubmit = true;

    if (!form.$valid) {
      return;
    }
    var params = new FormData();
    params.append("first_name", $scope.number['first_name']);
    params.append("last_name", $scope.number['last_name']);

    params.append("city", $scope.number['city']);
    params.append("state", $scope.number['state']);
    params.append("zip", $scope.number['zip']);
    params.append("country", $scope.number['country']['iso']);
    params.append("provider", $scope.number['provider']);
    params.append("number", $scope.number['number']);
    params.append("address_line_1", $scope.number['address_line_1']);
    params.append("address_line_2", $scope.number['address_line_2']);
    if (checkFile("#loa", "noLOA")) {
      params.append("loa", angular.element("#loa").prop("files")[0]);
    }
    if (checkFile("#csr", "noCSR")) {
      params.append("csr", angular.element("#csr").prop("files")[0]);
      return;
    }
    if (checkFile("#invoice", "noInvoice")) {
      params.append("invoice", angular.element("#invoice").prop("files")[0]);
      return;
    }
    $shared.isLoading = true;
    var errorMsg = "One of the documents could not be uploaded please be sure to upload a file size less than 10MB and use one of the following file formats: pdf,doc,doc";
    Backend.postFiles("/port/" + $stateParams['numberId'], params, true).then(function () {
      console.log("updated number..");
      $mdToast.show(
        $mdToast.simple()
        .textContent('Number port created..')
        .position("top right")
        .hideDelay(3000)
      );
      $state.go('ports', {});
    }, function() {
        $shared.endIsLoading();
      });
  }
  $scope.changeCountry = function (country) {
    console.log("changeCountry ", country);
    $scope.number.country = country;
  }
  $scope.documentURL = function (type) {
    var url;
    angular.forEach($scope.number.documents, function (document) {
      if (document.type === type) {
        url = document.url;
      }
    });
    return url;
  }
  $shared.isLoading = true;
  Backend.get("/port/" + $stateParams['numberId']).then(function (res) {
    $scope.number = res.data;
    angular.forEach($shared.billingCountries, function (country) {
      if (country.iso === $scope.number.country) {
        $scope.number.country = country;
      }
    });
    $scope.loa =
      $shared.endIsLoading();
  });
});

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionCodesCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Extension Codes");
  $scope.users = [];

  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        $q.all([
          Backend.get("/flow/list?all=1"),
          Backend.get("/settings/extensionCodes/list")

        ]).then(function(res) {
        $scope.flows = res[0].data.data;
        var codes = res[1].data;
        angular.forEach(codes, function(code) {
            angular.forEach($scope.flows, function(flow) {
              if ( flow.id === code.flow_id ) {
                code.flow = flow;
              }
            });
         });
         $scope.codes = codes;

        $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.saveCodes = function() {
    var codes = angular.copy($scope.codes).map(function(code) {
      delete code['flow'];
      return code;
    });
    var data = {"codes": codes};
    $shared.isCreateLoading = true;
    Backend.post("/settings/extensionCodes", data).then(function(res) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Extension codes updated..')
            .position("top right")
            .hideDelay(3000)
        );
        $shared.endIsCreateLoading();
    });
  }
 $scope.addCode = function() {
    var copy = {
      "name": "",
      "flow_id": null
    };
    $scope.codes.push(copy);
  }
  $scope.changeFlow = function($index) {
    console.log("changeFlow called ", arguments);
    console.log("codes are ", $scope.codes);
    $scope.codes[$index].flow_id = $scope.codes[$index].flow.id;
  }
  
  $scope.removeCode = function($index, code) {
    $scope.codes.splice($index, 1);
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q) {
    $shared.updateTitle("Create Extension");
    $scope.isDialog = false;
  $scope.values = {
    username: "",
    secret: "",
    tags: [],
    flow_id: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0,
    secretError: ""
  }
  $scope.triedSubmit = false;

  $scope.generateSecret = function() {
    Backend.get("/generateSecurePassword").then(function(res) {
    $scope.values.secret = res.data.password;
    });
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
      Backend.post("/verifyPasswordStrength", {
          'password': $scope.values.secret
      }).then(function(res) {
        if ( !res.data.success ) {
          $scope.ui.secretError = res.data.validationError;
          console.log($scope.ui);
          return;
        }
        var values = {};
        values['username'] = $scope.values.username;
        values['caller_id'] = $scope.values.caller_id;
        values['secret'] = $scope.values.secret;
        values['flow_id'] = $scope.values.flow_id;
        values['tags'] = $scope.values.tags;
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
        $shared.isCreateLoading = true;
        Backend.postCouldError("/extension", values).then(function(res) {
        console.log("updated extension..");
        console.log("save ext ", res);
        var id = res.headers("x-extension-id");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Created extension')
              .position("top right")
              .hideDelay(3000)
          );
          console.log("isDialog ", $scope.isDialog);

          if ( !$scope.isDialog ) {
            $state.go('extensions', {});
            $shared.endIsCreateLoading();
          } else {
            console.log("calling emit ", id);
            $scope.$emit("Created", id)
            $mdDialog.hide();
          }


          }, function() {

          });
      });
    }
  }
  $scope.keyupSecret = function() {
    console.log("keyupSecret called..");
    var secret = $scope.values.secret;
    console.log("secret is ", secret);
    if (secret.length < 8) {
      $scope.ui.secretError = "Password must be 8 or more characters.";
    } else if (!secret.match(/[0-9]+/g)) {
      $scope.ui.secretError = "Password include a number";
    } else if (!secret.match(/[A-Z]+/g)) {
      $scope.ui.secretError = "Password include an uppercase letter";
    } else if (!secret.match(/[a-z]+/g)) {
      $scope.ui.secretError = "Password include an lowercase letter";
    } else if (!secret.match(/[\'^£$%&*()}{@#~?><>,|=_+¬-]/g)) {
      $scope.ui.secretError = "Password must include a symbol";
    } else {
      $scope.ui.secretError = "";
    }
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $scope.setupFlow = function($event, extension) {
      var title = "Unititled Flow";
    if ( $scope.values.username !== '' ) {
      var title = "Flow for " + $scope.values.username;
    }

    $mdDialog.show({
      controller: SetupDialogController,
      templateUrl: 'views/dialogs/setup-flow.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      skipHide: true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "title": title,
        "category": "extension",
        "onSuccess": function(flowId) {
          load().then(function() {
            console.log("setting flow ", flowId);
            angular.forEach($scope.flows, function(flow) {
              if ( flow.public_id === flowId) {
                  $scope.values['flow_id'] = flow.id;
              }
            });
            $mdDialog.hide();
          } );
        },
        "onError": function(flowId) {
          console.error("error occured..");
        },

      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.init = function(isDialog) {
    $scope.isDialog = isDialog;
  }

  function load() {
    return $q(function(resolve, reject) {
      Backend.get("/flow/list?category=extension").then(function(res) {
        $scope.flows = res.data.data;
          $shared.endIsLoading();
          resolve();
      }, reject);
    });
  }
  $timeout(function() {
    load();
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionEditCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $stateParams, $shared, $q) {
	  $shared.updateTitle("Edit Extension");
  $scope.values = {
    username: "",
    secret: "",
    flow_id: "",
    tags: []
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0,
    secretError: ""
  }
  $scope.triedSubmit = false;
  $scope.load = function() {
  $shared.isLoading = true;
   $q.all([
      Backend.get("/flow/list?category=extension"),
      Backend.get("/extension/" + $stateParams['extensionId'])
   ]).then(function(res) {
      $scope.flows= res[0].data.data;
      $scope.extension = res[1].data;
      $scope.values = angular.copy( $scope.extension );
      $shared.endIsLoading();
    });
  }

  $scope.generateSecret = function() {
    Backend.get("/generateSecurePassword").then(function(res) {
    $scope.values.secret = res.data.password;
    });
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
      Backend.post("/verifyPasswordStrength", {
          'password': $scope.values.secret
      }).then(function(res) {
        if ( !res.data.success ) {
          $scope.ui.secretError = res.data.validationError;
          console.log($scope.ui);
          return;
        }
        var values = {};
        values['username'] = $scope.values.username;
        values['secret'] = $scope.values.secret;
        values['caller_id'] = $scope.values.caller_id;
        values['flow_id'] = $scope.values.flow_id;
        values['tags'] = $scope.values.tags;
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
        $shared.isCreateLoading = true;
        Backend.postCouldError("/extension/" + $stateParams['extensionId'], values).then(function() {
        console.log("updated extension..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Updated extension')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('extensions', {});
        $shared.endIsCreateLoading();
        });
      });
    }
  }
  $scope.keyupSecret = function() {
    console.log("keyupSecret called..");
    var secret = $scope.values.secret;
    console.log("secret is ", secret);
    if (secret.length < 8) {
      $scope.ui.secretError = "Password must be 8 or more characters.";
    } else if (!secret.match(/[0-9]+/g)) {
      $scope.ui.secretError = "Password include a number";
    } else if (!secret.match(/[A-Z]+/g)) {
      $scope.ui.secretError = "Password include an uppercase letter";
    } else if (!secret.match(/[a-z]+/g)) {
      $scope.ui.secretError = "Password include an lowercase letter";
    } else if (!secret.match(/[\'^£$%&*()}{@#~?><>,|=_+¬-]/g)) {
      $scope.ui.secretError = "Password must include a symbol";
    } else {
      $scope.ui.secretError = "";
    }
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $scope.load();
});



'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ExtensionsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("Extensions");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
    
    function DialogController($scope, $mdDialog, extension, $shared) {
      $scope.$shared = $shared;
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
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/extension/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'extensions');
      return $q(function(resolve, reject) {
        pagination.loadData().then(function(res) {
        $scope.extensions = res.data.data;
        $shared.endIsLoading();
        resolve();
        }, reject);
      });
  }
  $scope.editExtension = function(extension) {
    $state.go('extension-edit', {extensionId: extension.public_id});
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
        $shared.isLoading = true;
      Backend.delete("/extension/" + extension.public_id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('FaxesCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $sce, $shared, $q, $mdToast, $stateParams) {
    $shared.updateTitle("Faxes");
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.$stateParams = $stateParams
    $scope.Backend = Backend;
  $scope.settings = {
    page: 0
  };
  $scope.pagination = pagination;
  $scope.faxes = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
        pagination.changeUrl( "/fax/list" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'faxes' );
        pagination.loadData().then(function(res) {
        var faxes = res.data.data;
        $scope.faxes = faxes.map(function(obj) {
          obj.uri = $sce.trustAsResourceUrl(obj.uri);
          return obj;
        });
        $shared.endIsLoading();
        resolve();
      }, reject)
    });
  }
  $scope.deleteFax = function($event, fax) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this fax?')
          .textContent('This will permantely remove the fax from your storage')
          .ariaLabel('Delete fax')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/fax/" + fax.id).then(function() {
        console.log("deleted fax..");
        $scope.load().then(function() {
          $mdToast.show(
            $mdToast.simple()
              .textContent('fax deleted..')
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('FilesCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Extension Codes");
  $scope.files = [];
  $scope.Backend = Backend;

  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/file/list").then(function(res) {
          $scope.files = res.data.data;
          $shared.endIsLoading();
          //loadPicker();
            resolve();
          }, function() {
            reject();
          });
        });
  }

  $scope.addFile = function($event) {
    $mdDialog.show({
      controller: DialogSelectController,
      templateUrl: 'views/dialogs/select-addfile.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onFinished: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });
  }

  $scope.deleteFile = function($event, file) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this media file?')
          .textContent('please note that any call flows using this media file may be effected.')
          .ariaLabel('Delete file')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/file/" + file.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('File deleted..')
                .position("top right")
                .hideDelay(3000)
            );
          });

      })
    }, function() {
    });
  }

function DialogUploadController($scope, $mdDialog, Backend, $shared, onFinished) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        file: null
      };
      $scope.submit = function($event) {
        var files = angular.element("#uploadFile").prop("files");
        if ( files.length === 0 ) {
          $scope.errorText="Please select atleast 1 file..";
          return;
        }
        var params = new FormData();
        angular.forEach(files, function(file) {
          params.append("file[]", file);
        });
        $shared.isCreateLoading = true;
        Backend.postFiles("/file/upload", params, true).then(function(res) {
          var data = res.data;
          $shared.endIsCreateLoading();
          if (data.amountFailed > 0) {
              angular.forEach(data.results, function(result) {
                if ( !result.success ) {
                  var msg = result.name + " failed to upload please check the file type and size";
                  $shared.showToast( msg );
                }
              });
            }
            $mdDialog.hide();
            onFinished();
        });
      }
      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }


    function DialogSelectController($scope, $mdDialog, Backend, $shared, onFinished) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.data = {
        number: ""
      };
      $scope.clickUpload= function($event) {
    $mdDialog.show({
      controller: DialogUploadController,
      templateUrl: 'views/dialogs/upload-addfile.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onFinished: function() {
          onFinished();
        }

      }
    })
    .then(function() {
    }, function() {
    });
      }
      $scope.clickGoogle= function($event) {
        //var data = angular.copy($scope.data);
        loadPicker();
      }

      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }


        // Scope to use to access user's Drive items.
    var scope = ['https://www.googleapis.com/auth/drive.file'];

    var pickerApiLoaded = false;
    var oauthToken;

    // Use the Google API Loader script to load the google.picker script.
    function loadPicker() {
      gapi.load('auth', {'callback': onAuthApiLoad});
      gapi.load('picker', {'callback': onPickerApiLoad});
    }

    function onAuthApiLoad() {
      window.gapi.auth.authorize(
          {
            'client_id': google.clientId,
            'scope': scope,
            'immediate': false
          },
          handleAuthResult);
    }

    function onPickerApiLoad() {
      pickerApiLoaded = true;
      createPicker();
    }

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
      }
    }

    // Create and render a Picker object for searching images.
    function createPicker() {
      if (pickerApiLoaded && oauthToken) {
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("audio/vnd.wave,audio/wav,audio/wave,audio/x-wav,audio/wav,audio/mpeg,audio/mp3");
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(google.appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            //.addView(new google.picker.DocsUploadView())
            .setDeveloperKey(google.developerKey)
            .setCallback(pickerCallback)
            .build();
         picker.setVisible(true);
      }
    }

    // A simple callback implementation.
    function pickerCallback(data) {
      if (data.action == google.picker.Action.PICKED) {
        var files = [];
        var fileId = data.docs[0].id;
        files.push(fileId);
        //alert('The user selected: ' + fileId);
        var data = {
          "files": files,
          "accessToken": oauthToken
        };
        $shared.isCreateLoading = true;
        Backend.post("/file/uploadFromGoogleDrive", data).then(function(res) {
          var data = res.data;
          $shared.endIsCreateLoading();
          if (data.amountFailed > 0) {
              angular.forEach(data.results, function(result) {
                if ( !result.success ) {
                  var msg = result.name + " failed to upload please check the file type and size";
                  $shared.showToast( msg );
                }
              });
            }
            $timeout(function() {
              $scope.$apply();
              $mdDialog.hide();
              $scope.load();
            }, 0);
        });

      }
    }
        $scope.promptCopied = function () {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Copied to clipboard!')
            .position("top right")
            .hideDelay(3000)
          );

        }
  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('FlowEditorCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $stateParams, $sce, $window) {
	  $shared.updateTitle("Flow Editor");
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
  var token = $shared.getAuthToken();
  var workspace = $shared.getWorkspace();
  if ($stateParams['flowId'] === "new" ) {
    flowUrl = $shared.FLOW_EDITOR_URL+"/create?auth="+token.token.auth + "&workspaceId=" + workspace.id + "&mode=" + $window.localStorage.getItem("THEME");
  } else {
    flowUrl = $shared.FLOW_EDITOR_URL + "/edit?flowId=" + $stateParams['flowId']+"&auth="+token.token.auth+ "&workspaceId="+ workspace.id + "&mode=" + $window.localStorage.getItem("THEME");
  }
  var adminToken = localStorage.getItem("ADMIN_TOKEN");
  if (adminToken) {
      flowUrl += "&admin=" +  adminToken;
  }

  $scope.flowUrl = $sce.trustAsResourceUrl(flowUrl);
  console.log("flow url is ", $scope.flowUrl);
  $shared.collapseNavbar();

  var element = angular.element(".flow-editor-iframe");
  sizeTheIframe();
  angular.element("window").on("resize.editor", function() {
    sizeTheIframe();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('FlowsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("Flows");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.settings = {
    page: 0
  };
  $scope.flows = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading =true;
        pagination.resetSearch();
        pagination.changeUrl( "/flow/list" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'flows' );
        pagination.loadData().then(function(res) {
        $scope.flows = res.data.data;
        $shared.endIsLoading();
        resolve();
      }, reject);
    });
  }
  $scope.editFlow = function(flow) {
    $shared.changeRoute('flow-editor', {flowId: flow.public_id});
  }
  $scope.createFlow = function() {
    $shared.changeRoute('flow-editor', {flowId: "new"}); 
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
      $shared.isLoading = true;
      Backend.delete("/flow/" + flow.id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('GeoPermissionCtrl', function ($scope, Backend, pagination, $location, $state, $stateParams, $mdDialog, $shared) {
    $shared.updateTitle("GeoPermission");
    console.log("STATE PARAMS ", $stateParams);
    $scope.geoCountries = [];
    $scope.load = function() {
      Backend.get("/workspaceRoutingACL/list").then((item) => {
        item.data.forEach((country) => {
          if (country.preset_acl_enabled && country.enabled === null) country.enabled = country.preset_acl_enabled;
        });
        return item;
      }).then(function(res) {
        $shared.isLoading = false;
        $scope.geoCountries = res.data;
      })
    }
    $scope.updateACLs = function() {
      const requestData = $scope.geoCountries.map((country) => {

        //0 - creating object
        const object = {
          routing_acl_id: country.routing_acl_id,
          enabled: country.enabled,
        };

        //1 - adding the workspace id if it exists if not then we are creating a new one
        if (country.workspace_acl_id) object.id = country.workspace_acl_id;
        return object;
      });

      Backend.post('/workspaceRoutingACL/saveACLs', requestData)
        .then(function(response) {
          console.log('Success:', response);
        }, function(error) {
          console.log('Error:', error);
        });
    };
    $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HostedTrunksCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("Hosted Trunks");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.trunks = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/trunk/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'trunks' );
      pagination.loadData().then(function(res) {
      $scope.trunks = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.editTrunk = function(trunk) {

    $state.go('hosted-trunks-edit', {trunkId: trunk.public_id});
  }
  $scope.createTrunk = function(trunk) {
    $state.go('hosted-trunks-create');
  }
  $scope.deleteTrunk = function($event, trunk) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this trunk?')
          .textContent('you will not be able to use this trunk any longer')
          .ariaLabel('Delete')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/trunk/" + trunk.public_id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HostedTrunksCreateCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Trunks");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.numbers = [];
    $scope.Backend = Backend;
    $scope.step = 1;
    $scope.triedSubmit = false;
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
  $scope.values = {};
  $scope.load = function() {
    Backend.get("/did/list?all=1").then((res) =>  {
      numbers = res.data.data;
      $shared.endIsLoading();
    });
  }
  $scope.checkTrunkFields = function() {
    if ($scope.values.recovery_sip_uri && $scope.values.sip_uri && $scope.values.termination_sip_uri && $scope.values.name) {
      $scope.errorMessage = null;
    } 
  };
  $scope.validatePrevForm = function () {
    $scope.step--;
    $scope.triedSubmit = false;
  };
  $scope.validateStepForm = function(form, step) {
    if (step > $scope.step && !form.$valid) {
      $scope.triedSubmit = true;
      return;
    }
    if (step > $scope.step + 1) return;
    $scope.triedSubmit = false;
    $scope.step = step;
  };
  $scope.saveTrunk = function(trunk) {
    console.log('save trunk called...');
    $scope.triedSubmit = true;
    var params = angular.copy( $scope.values );
    params['record'] = params.record||false;
    params['orig_settings'] = {
      recovery_sip_uri: params.recovery_sip_uri
    };
   params['orig_endpoints'] = [{
      sip_uri: params.sip_uri
   }];
   //todo need to integrate with frontend
   params['term_acls'] = [];
   params['term_creds'] = [];
   params['term_settings'] = {
      sip_addr: params.termination_sip_uri
   };
   if(!params.recovery_sip_uri || !params.sip_uri || !params.termination_sip_uri || !params.name){
      $scope.errorMessage = 'Please fill in all fields before submitting';
      return;
   }
   params['did_numbers'] =$scope.numbers.filter( function( number ) {
    return number.checked;
   });
   console.log('saveTrunk params are ', params);
    Backend.post("/trunk", params).then(function() {
        console.log("created trunk..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('created trunk')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('hosted-trunks', {});
      $shared.endIsCreateLoading();
    });
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HostedTrunksEditCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Trunks");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
  $scope.values = {};
  $scope.load = function() {
      var url ='/trunk/' + $stateParams['trunkId'];
      $q.all([
        Backend.get("/did/list?all=1"),
        Backend.get(url)
     ]).then(function(res) {
        console.log("trunk data ", res);
        var data = res[1].data;
        var trunkId = data.id;
        var numbers = res[0].data.data.map( function( item ) {
            var copied = angular.copy( item );
            copied.checked = false;
            
            if ( item.trunk_id === trunkId ) {

                copied.checked = true;
            }
            return copied;
        });
        console.log('NUMBERS ARE ', numbers);
        $scope.numbers = numbers;
        $scope.values = angular.copy( data );

        $scope.values['recovery_sip_uri'] = data['orig_settings']['recovery_sip_uri'];
        $scope.values['sip_uri'] = data['orig_endpoints'][0].sip_uri;
        $scope.values['termination_sip_uri'] = data['term_settings']['sip_addr'];

 
        $shared.endIsLoading();
    });
  }
  $scope.editTrunk = function(trunk) {
    console.log('save trunk called...');
    var params = angular.copy( $scope.values );
    params['record'] = params.record||false;
    params['orig_settings'] = {
      recovery_sip_uri: params.recovery_sip_uri
    };
   params['orig_endpoints'] = [{
      sip_uri: params.sip_uri
   }];
   //todo need to integrate with frontend
   params['term_acls'] = [];
   params['term_creds'] = [];
   params['term_settings'] = {
      sip_addr: params.termination_sip_uri
   };
   params['did_numbers'] =$scope.numbers.filter( function( number ) {
    return number.checked;
   });

   console.log('saveTrunk params are ', params);
    Backend.post("/trunk/" + $stateParams['trunkId'], params).then(function() {
        console.log("updated trunk..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('updated trunk')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('hosted-trunks', {});
      $shared.endIsCreateLoading();
    });
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('IpWhitelistCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("IP Whitelist");
      $scope.settings = {
        disabled: false
      }
      $scope.Backend = Backend;
    function DialogController($scope, $mdDialog, Backend, $shared, onCreated) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.ranges = [
        "/8",
        "/16",
        "/24",
        "/32"
      ];
      $scope.data = {
        ip: "",
        range: "/32",
      };
      $scope.submit= function() {
        var data = angular.copy($scope.data);
        Backend.post("/settings/ipWhitelist", data).then(function(res) {
           $mdToast.show(
          $mdToast.simple()
            .textContent('IP added')
            .position("top right")
            .hideDelay(3000)
        );
            $scope.close();
            onCreated();
        });
      }

      $scope.close = function() {
        $mdDialog.hide(); 
      }
    }

  $scope.ips = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        $q.all([
          Backend.get("/self"),
          Backend.get("/settings/ipWhitelist/list")
         ]).then(function(res) {
          $scope.disabled = res[0].data.ip_whitelist_disabled;
          $scope.settings.disabled = $scope.disabled;
          $scope.ips = res[1].data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.createIp = function($event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/add-ip-whitelist.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onCreated: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.deleteIp = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this IP address?')
          .textContent('This will permantely remove the IP from your whitelist')
          .ariaLabel('Delete IP')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/settings/ipWhitelist/" + number.public_id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('IP deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }
  $scope.enableWhitelist = function($event, value) {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        var data = {"ip_whitelist_disabled": value};
        Backend.post("/updateSelf", data).then(function(res) {
          $scope.load();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.changeDisableState = function($event, value) {
    console.log("changeDisableState ", value);
    $scope.enableWhitelist($event, true);
  }
  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('DebuggerLogViewCtrl', function ($scope, Backend, $location, $state, $mdDialog, $stateParams, $sce, $shared) {
	  $shared.updateTitle("Log View");
  $scope.log = null;
  $scope.load = function() {
    $shared.isLoading =true;
    Backend.get("/log/" + $stateParams['logId']).then(function(res) {
      console.log("log is ", res.data);
      $shared.isLoading =false;
      var log = res.data;
      $scope.log = log;
    })
  }
  $scope.load();
});


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

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('MyNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("My Numbers");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.numbers = [];
  console.log("STATE PARAMS ", $stateParams)
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/did/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.buyNumber = function() {
    $state.go('buy-numbers', {});
  }
  $scope.editNumber = function(number) {

    $state.go('my-numbers-edit', {numberId: number.public_id});
  }
  $scope.editFlow = function(number) {
    const flowId = number.flow_public_id;
    $state.go('flow-editor', {flowId: flowId});
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
      $shared.isLoading = true;
      Backend.delete("/did/" + number.id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('MyNumbersEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $q, $mdToast, $shared) {
	  $shared.updateTitle("Edit Number");
  $scope.flows = [];
  $scope.didActions = [
    {
      name: 'Accept Call',
      value: 'accept-call'
    },
    {
      name: 'None',
      value: 'none'
    },
    /*
    {
      name: 'Accept Fax',
      value: 'accept-fax'
    },
    */

  ]
  $scope.number = null;
  $scope.saveNumber = function(number) {
    var params = {};
    params['name'] = $scope.number.name;
    params['flow_id'] = $scope.number.flow_id;
    params['did_action'] = $scope.number.did_action;
    params['tags'] = $scope.number.tags;
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
      $shared.isCreateLoading = true;
    Backend.post("/did/" + $stateParams['numberId'], params).then(function() {
        console.log("updated number..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Number updated..')
            .position(toastPosStr)
            .hideDelay(3000)
        );
        $state.go('my-numbers', {});
      $shared.endIsCreateLoading();
    });
  }
  $scope.changeFlow = function(flow) {
    $scope.number.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.changeDIDAction = function(action) {
    $scope.number.did_action = action;
    console.log("changeDIDAction", action);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }

  $scope.setupFlow = function($event, extension) {
    $mdDialog.show({
      controller: SetupDialogController,
      templateUrl: 'views/dialogs/setup-flow.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "title": "DID flow for " + $scope.number.number,
        "category": "did",
        "onSuccess": function(flowId) {

          Backend.get("/flow/list?all=1").then(function(res) {
            console.log("setting flow ", flowId);
            $scope.flows = res.data.data;
            angular.forEach($scope.flows, function(flow) {
              if ( flow.public_id === flowId) {
                  $scope.number['flow_id'] = flow.id;
              }
            });
            $shared.endIsLoading();
            $mdDialog.hide();
          } );
        },
        "onError": function(flowId) {
          console.error("error occured..");
        },

      }
    })
    .then(function() {
    }, function() {
    });
  }



  $shared.isLoading = true;
  $q.all([
    Backend.get("/flow/list?all=1"),
    Backend.get("/did/" + $stateParams['numberId'])
  ]).then(function(res) {
    $scope.flows = res[0].data.data;
    $scope.number = res[1].data;
    $shared.endIsLoading();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
	  $shared.updateTitle("Create Phone");
  $scope.values = {
    name: "",
    phone_type: null,
    mac_address: "",
    group_id: null,
    tags: []
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
    console.log("submitting phone form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['name'] = $scope.values.name;
      values['mac_address'] = $scope.values.mac_address;
      values['phone_type'] = $scope.values.phone_type;
      values['group_id'] = $scope.values.group_id;
      values['tags'] = $scope.values.tags;
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
      $shared.isCreateLoading = true;
      Backend.post("/phone", values).then(function() {
       console.log("updated phone..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created phone')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('phones-phones', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
  $timeout(function() {
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/list?all=1")
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
        $shared.endIsLoading();
    });
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneDeployCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $mdToast) {
    $shared.updateTitle("Phone Deploy");
    $scope.pagination = pagination;
    $scope.phones = [];
    $scope.step = 1;

    $scope.start = function() {
      $shared.isLoading = true;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Started deployment..')
                .position("top right")
                .hideDelay(3000)
            );
      Backend.post("/startDeploy").then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Deployment completed..')
                .position("top right")
                .hideDelay(3000)
            );
            $scope.step = 2;
            $shared.endIsLoading();
      });
    }
    $shared.isLoading = true;

  Backend.get("/getDeployInfo").then(function(res) {
    $scope.info = res.data;
    console.log("got deploy info step is: " + $scope.step);
    $shared.endIsLoading();
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $mdToast, $timeout, $shared, $q ) {
	  $shared.updateTitle("Edit Phone");
  $scope.values = {
    name: "",
    phone_type: null,
    mac_address: "",
    group_id: null,
    tags: []
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
    console.log("submitting phone form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['name'] = $scope.values.name;
      values['mac_address'] = $scope.values.mac_address;
      values['phone_type'] = $scope.values.phone_type;
      values['group_id'] = $scope.values.group_id;
      values['tags'] = $scope.values.tags;
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
      $shared.isLoading = true;
      Backend.post("/phone/" + $stateParams['phoneId'], values).then(function() {
       console.log("updated phone..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Edited phone')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('phones-phones', {});
        $shared.endIsEditLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $scope.changeFlow = function(flow) {
    $scope.values.flow_id = flow;
    console.log("changeFlow", flow);
  }
  $scope.editFlow = function(flowId) {
    $state.go('flow-editor', {flowId: flowId});
  }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $shared.isLoading = true;
  $timeout(function() {
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/list?all=1"),
      Backend.get("/phone/" + $stateParams['phoneId'])
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
      $scope.values = res[2].data;
        $shared.endIsLoading();
    });
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGlobalSettingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast) {
    $shared.updateTitle("PhoneGlobalSettings");
    $scope.settings = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      Backend.get( "/phoneGlobalSetting/list" ).then(function(res) {
          $scope.settings = res.data.data;
          $shared.endIsLoading();
          resolve();
      });
    });
  }
  $scope.createSettings =  function() {
    $state.go('phones-global-settings-create');
  }
  $scope.modifyPhoneSetting = function($event, phoneSettings) {
    console.log("edit phone settings ", phoneSettings);
    $state.go('phones-global-settings-modify', {phoneSettingId: phoneSettings.public_id});
  }
  $scope.deletePhoneSettings = function($event, phoneSettings) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone settings group?')
          .textContent('If you delete this phone setting group it will also delete all related setting templates')
          .ariaLabel('Delete phone setting')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phoneGlobalSetting/" + phoneSettings.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Phone deleted..')
                .position("top right")
                .hideDelay(3000)
            );
          });

      })
    }, function() {
    });
  }
  $timeout(function() {
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/list?all=1")
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
        $shared.endIsLoading();
    });
  }, 0);

    $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGlobalSettingsCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast) {
    $shared.updateTitle("PhoneGlobalSettings Create");
    $scope.settings = [];
    $scope.values = {
      phone_type: null,
      group_id: null,
    };
    $scope.submit = function(form) {
      console.log("submitting phone form ", arguments);
      $scope.triedSubmit = true;
      if (form.$valid) {
        var values = {};
        values['phone_type'] = $scope.values.phone_type;
        values['phone_group'] = $scope.values.group_id;
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
        $shared.isCreateLoading = true;
        Backend.post("/phoneGlobalSetting", values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Created phone settings')
              .position("top right")
              .hideDelay(3000)
          );
          console.log("res is ", res);
          var id = res.headers("X-GlobalSetting-ID");
          console.log("global setting id is", id);
          $state.go('phones-global-settings-modify', {phoneSettingId:id});
          $shared.endIsCreateLoading();
        });
      }
    }


  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
  $timeout(function() {
    $shared.isLoading = true;
    $q.all([
      Backend.get("/phone/phoneDefs"),
      Backend.get("/phoneGroup/list?all=1")
    ]).then(function(res) {
      $scope.phoneDefs = res[0].data;
      $scope.phoneGroups = res[1].data.data;
        $shared.endIsLoading();
    });
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGlobalSettingsModifyCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
    $shared.updateTitle("PhoneGlobalSettings Create");
    $scope.settings = [];
    $scope.values = {
      phone_type: null,
      group_id: null,
    };
    $scope.submit = function(form) {
      console.log("submitting phone form ", arguments);
      $scope.triedSubmit = true;
      if (form.$valid) {
        var values = {};
        values['phone_type'] = $scope.values.phone_type;
        values['phone_group'] = $scope.values.group_id;
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
        $shared.isCreateLoading = true;
        Backend.post("/phoneGlobalSetting", values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Updated phone settings')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('phones-global-settings-modify', {phoneSettingId:res.headers("X-GlobalSetting-ID")});
          $shared.endIsCreateLoading();
        });
      }
    }


    $scope.openCategory = function(category) {
          $state.go('phones-global-settings-modify-category', {
            phoneSettingId:$stateParams['phoneSettingId'],
            categoryId:category['name']
          });
    }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
    $shared.isLoading = true;
  Backend.get("/phoneGlobalSetting/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }

    $shared.isLoading = true;
    Backend.get("/getPhoneDefaults", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
      $scope.template = res.data;
      $shared.endIsLoading();
    });
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGlobalSettingsModifyCategoryCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
    $shared.updateTitle("PhoneGlobalSettings Create");
    $scope.$stateParams = $stateParams;
    $scope.settings = [];
    $scope.fields = [];
    $scope.submit = function(form) {
      console.log("submitting phone form ", arguments);
      $scope.triedSubmit = true;
      if (form.$valid) {
        var values = {};
        angular.forEach($scope.fields, function(field) {
          values[ field.setting_variable_name ] = field.value;
        });
        console.log("sending result ", values);
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
        $shared.isLoading = true;
        Backend.post("/phoneGlobalSetting/" + $stateParams['phoneSettingId'], values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Updated phone settings')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('phones-global-settings-modify', {phoneSettingId:$stateParams['phoneSettingId']});
          $shared.endIsCreateLoading();
        });
      }
    }


    $scope.openCategory = function(category) {
          $state.go('phones-global-settings-modify-category', {
            phoneSettingId:$stateParams['phoneSettingId'],
            categoryId:category['name']
          });
    }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
$scope.changeSelectValue = function(field, fieldValue)
{
  console.log("changeSelectValue ", arguments);
  field.value = fieldValue;
  console.log("fields are now ", $scope.fields);
}
$scope.createOptions = function(field) 
  {
    var start = 1;
    var end= 20;
    var options = [];
    while (start <= end) {
      var value = field['setting_option_' + start];
      var name = field['setting_option_' + start + '_name'];
      var option = {
        name: name,
        value: value
      };
      options.push( option );
      start = start + 1;
    }
    return options;
  }

    $shared.isLoading = true;
  Backend.get("/phoneGlobalSetting/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }
    qsMap['settingId'] = $stateParams['phoneSettingId'];
    qsMap['categoryId'] = $stateParams['categoryId'];
    Backend.get("/getPhoneSettingsByCat", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
      $scope.template = res.data.settings;
      $scope.values = res.data.values;
      angular.forEach($scope.template, function(field) {
        $scope.fields.push( field );
      });
      angular.forEach($scope.values, function(value) {
        angular.forEach($scope.fields, function(field) {
          if (field.setting_variable_name === value.setting_variable_name) {
            field.value = value.setting_option_1;
          }
        });
      });

      $shared.endIsLoading();
    });
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGroupsCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
	  $shared.updateTitle("Create Phone Group");
  $scope.values = {
    number: "",
    name: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.onNumberChange = function() {
    if ($scope.values.number) {
      $scope.values.number = Number($scope.values.number.replace(/[^0-9]/g, '').slice(0, 4));
    }
  }
  $scope.submit = function(form) {
    console.log("submitting phone form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['number'] = $scope.values.number;
      values['name'] = $scope.values.name;
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
      $shared.isCreateLoading = true;
      Backend.post("/phoneGroup", values).then(function() {
       console.log("updated phone..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created phone group')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('phones-groups', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $shared.endIsLoading();
  });


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGroupsEditCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $stateParams ) {
	  $shared.updateTitle("Create Phone Group");
  $scope.values = {
    number: "",
    name: ""
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.onNumberChange = function() {
    if ($scope.values.number) {
      $scope.values.number = Number($scope.values.number.replace(/[^0-9]/g, '').slice(0, 4));
    }
  }
  $scope.submit = function(form) {
    console.log("submitting phone form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {};
      values['number'] = $scope.values.number;
      values['name'] = $scope.values.name;
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
      $shared.isCreateLoading = true;
      Backend.post("/phoneGroup/" + $stateParams['phoneGroupId'], values).then(function() {
       console.log("updated phone..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Updated phone group')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('phones-groups', {});
        $shared.endIsCreateLoading();
      });
    }
  }


      Backend.get("/phoneGroup/" + $stateParams['phoneGroupId']).then(function(res) {
        $scope.values = res.data;
      });

  });


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneGroupsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $stateParams) {
    $shared.updateTitle("PhoneGroups");
    $scope.phoneGroups = [];
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.load = function() {
   $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/phoneGroup/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'phoneGroups' );
      pagination.loadData().then(function(res) {
        $scope.phoneGroups= res.data.data;
        $shared.endIsLoading();
    })
  }
  $scope.createPhoneGroup = function() {
    $state.go('phones-groups-create');

  }
  $scope.editPhoneGroup = function($event, phoneGroup) {
    console.log("edit phone group ", phoneGroup);
    $state.go('phones-groups-edit', {phoneGroupId: phoneGroup.public_id});
  }
  $scope.deletePhoneGroup = function($event, group) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone group?')
          .textContent('If you delete this phone group it will also delete all related setting templates')
          .ariaLabel('Delete phone group')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phoneGroup/" + group.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Phone deleted..')
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneIndividualSettingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout) {
    $shared.updateTitle("PhoneIndividualSettings");
    $scope.settings = [];
  $scope.load = function() {
      Backend.get( "/phoneIndividualSetting/list" ).then(function(res) {
          $scope.settings = res.data.data;
          $shared.endIsLoading();
      });
  }
  $scope.modifyPhoneSetting = function($event, phoneSettings) {
    console.log("edit phone settings ", phoneSettings);
    $state.go('phones-individual-settings-modify', {phoneSettingId: phoneSettings.public_id});
  }
  $scope.deletePhoneSettings = function($event, phoneSettings) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone settings group?')
          .textContent('If you delete this phone setting group it will also delete all related setting templates')
          .ariaLabel('Delete phone setting')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phoneGlobalSetting/" + phone.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Phone deleted..')
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneIndividualSettingsModifyCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
    $shared.updateTitle("PhoneIndividualSettings Create");
    $scope.settings = [];
    $scope.values = {
      phone_type: null,
      group_id: null,
    };

    $scope.openCategory = function(category) {
          $state.go('phones-individual-settings-modify-category', {
            phoneSettingId:$stateParams['phoneSettingId'],
            categoryId:category['name']
          });
    }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
    $shared.isLoading = true;
  Backend.get("/phoneIndividualSetting/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }

    $shared.isLoading = true;
    Backend.get("/getPhoneDefaults", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
      $scope.template = res.data;
      $shared.endIsLoading();
    });
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhoneIndividualSettingsModifyCategoryCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $timeout, $mdToast, $stateParams) {
    $shared.updateTitle("PhoneIndividualSettings Create");
    $scope.$stateParams = $stateParams;
    $scope.settings = [];
    $scope.fields = [];
    $scope.submit = function(form) {
      console.log("submitting phone form ", arguments);
      $scope.triedSubmit = true;
      if (form.$valid) {
        var values = {};
        angular.forEach($scope.fields, function(field) {
          values[ field.setting_variable_name ] = field.value;
        });
        console.log("sending result ", values);
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
        $shared.isLoading = true;
        Backend.post("/phoneIndividualSetting/" + $stateParams['phoneSettingId'], values).then(function(res) {
        console.log("updated phone..");
          $mdToast.show(
            $mdToast.simple()
              .textContent('Updated phone settings')
              .position("top right")
              .hideDelay(3000)
          );
          $state.go('phones-individual-settings-modify', {phoneSettingId:$stateParams['phoneSettingId']});
          $shared.endIsCreateLoading();
        });
      }
    }


    $scope.openCategory = function(category) {
          $state.go('phones-individual-settings-modify-category', {
            phoneSettingId:$stateParams['phoneSettingId'],
            categoryId:category['name']
          });
    }
  $scope.changePhoneType = function(phoneType)
  {
    console.log("change phone type ", phoneType);
    $scope.values['phone_type'] = phoneType;
  }
  $scope.changePhoneGroup = function(phoneGroup)
  {
    console.log("change phone group ", phoneGroup);
    $scope.values['group_id'] = phoneGroup;
  }
$scope.changeSelectValue = function(field, fieldValue)
{
  console.log("changeSelectValue ", arguments);
  field.value = fieldValue;
  console.log("fields are now ", $scope.fields);
}
$scope.createOptions = function(field) 
  {
    var start = 1;
    var end= 20;
    var options = [];
    while (start <= end) {
      var value = field['setting_option_' + start];
      var name = field['setting_option_' + start + '_name'];
      var option = {
        name: name,
        value: value
      };
      options.push( option );
      start = start + 1;
    }
    return options;
  }

    $shared.isLoading = true;
  Backend.get("/phoneIndividualSetting/"+$stateParams['phoneSettingId']).then(function(res) {
    var item = res.data;
    var qsMap = {};
    if (item.phone_type) {
        qsMap['phoneType'] = item.phone_type;
    }
    if (item.group_id) {
        qsMap['groupId'] = item.group_id;
    }
    qsMap['settingId'] = $stateParams['phoneSettingId'];
    qsMap['categoryId'] = $stateParams['categoryId'];
    Backend.get("/getPhoneIndividualSettingsByCat", {"params": qsMap}).then(function(res) {

      console.log("settings ", res.data);
      $scope.template = res.data.settings;
      $scope.values = res.data.values;
      angular.forEach($scope.template, function(field) {
        $scope.fields.push( field );
      });
      angular.forEach($scope.values, function(value) {
        angular.forEach($scope.fields, function(field) {
          if (field.setting_variable_name === value.setting_variable_name) {
            field.value = value.setting_option_1;
          }
        });
      });

      $shared.endIsLoading();
    });
  });
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PhonesCtrl', function ($scope, Backend, $location, $state, $mdDialog, $shared, $q, pagination, $mdToast, $stateParams) {
    $shared.updateTitle("Phones");
    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
    $scope.phones = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
          pagination.resetSearch();
          pagination.changeUrl( "/phone/list" );
          pagination.changePage( 1 );
          pagination.changeScope( $scope, 'phones' );
          pagination.loadData().then(function(res) {
          $scope.calls = res.data.data;
          $shared.endIsLoading();
          resolve();
        })
      });
  }
  $scope.createPhone = function() {
    $state.go('phones-phone-create');

  }
  $scope.editPhone = function($event, phone) {
    console.log("editPhone ", phone);
    $state.go('phones-phone-edit', {phoneId: phone.public_id});
  }
  $scope.deletePhone = function($event, phone) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this phone?')
          .textContent('If you delete this phone you will not be able to call it anymore')
          .ariaLabel('Delete phone')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/phone/" + phone.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Phone deleted..')
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PortNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q, $stateParams) {
    $shared.updateTitle("Ported Numbers");

    $scope.$stateParams = $stateParams;
    $scope.$shared = $shared;
    $scope.pagination = pagination;
    $scope.Backend = Backend;
  $scope.numbers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/port/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.portNumber = function() {
    $state.go('port-create', {});
  }
  $scope.editNumber = function(number) {
    $state.go('port-edit', {numberId: number.public_id});
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
      $shared.isLoading = true;
      Backend.delete("/port/" + number.id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('RecordingsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $sce, $shared, $q, $mdToast, $stateParams) {
	  $shared.updateTitle("Recordings");
  $scope.settings = {
    page: 0
  };
  var startDate = new moment().startOf('month');
  var endDate = new moment().endOf("month");
  $scope.filterArgs = {
    "tags": "",
    "from": "",
    "to": "",
    "start_date": startDate.toDate(),
    "end_date": endDate.toDate(),
  };
    $scope.pagination = pagination;
    $scope.$stateParams = $stateParams;

    $scope.$shared = $shared;
  $scope.pagination = pagination;
  $scope.Backend = Backend;
  $scope.recordings = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
        pagination.changeUrl( "/recording/list" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'recordings' );
        pagination.loadData().then(function(res) {
        var recordings = res.data.data;
        $scope.recordings = recordings.map(function(obj) {
          //obj.uri = $sce.trustAsResourceUrl(obj.uri);
          obj['public_url'] = $sce.trustAsResourceUrl(obj.s3_url);
          return obj;
        });
        $shared.endIsLoading();
        resolve();
      }, reject)
    });
  }
  $scope.filter = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      var queryArgs = Object.assign({}, $scope.filterArgs);
      pagination.resetSearch();
        pagination.changeUrl( "/recording/list" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'recordings' );
        pagination.loadData(queryArgs).then(function(res) {
        var recordings = res.data.data;
        $scope.recordings = recordings.map(function(obj) {
          //obj.uri = $sce.trustAsResourceUrl(obj.uri);
          obj['public_url'] = $sce.trustAsResourceUrl(obj.s3_url);
          return obj;
        });
        $shared.endIsLoading();
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
      $shared.isLoading = true;
      Backend.delete("/recording/" + recording.id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportCtrl', function($scope, $location, $timeout, $stateParams, $q, Backend, pagination, $shared, $state, $mdToast, $mdDialog, $window) {
	  $shared.updateTitle("Support");
		$scope.$stateParams = $stateParams;
		$scope.pagination = pagination;
	  $scope.$shared = $shared;
		$scope.settings = {
			page: 0
		};
	  $scope.supportTickets = [];

	function loadData(createLoading) {
		console.log("support load data started")
		if (createLoading) {
			$shared.isCreateLoading =true;
		} else {
			$shared.isLoading =true;
		}

		return $q(function(resolve, reject) {
			console.log("loading support tickets");
			Backend.get("/supportTicket/list").then(function(res) {
				console.log("finished loading..");
				$scope.supportTickets = res.data.data;
				if (createLoading) {
					$shared.endIsCreateLoading();
				} else {
					$shared.endIsLoading();
				}
				console.log("support tickets ", $scope.supportTickets);
				resolve();
			}, reject);
		});
	}
  $scope.load = function() {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/supportTicket/list" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'supportTickets');
      return $q(function(resolve, reject) {
        pagination.loadData().then(function(res) {
        $scope.supportTickets = res.data.data;
        $shared.endIsLoading();
        resolve();
        }, reject);
      });
  }

	$scope.createSupportTicket = function() {
    	$state.go('support-create', {});
	}
	$scope.updateSupportTicket = function(ticket) {
		console.log("going to support ticket ", ticket);
		$state.go('support-update', {ticketId: ticket.public_id});
	}
	//loadData(false);
  	$scope.load();
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportCreateCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window) {
	$shared.updateTitle("Create Support ticket");
	$scope.$shared = $shared;

	$scope.values = {
		category: "",
		subject: "",
		comment: "",
		extension: "",
	};
	$scope.changeCategory = function(category) {
		$scope.values.category = category;
		console.log("changeCategory", category);
	}

	$scope.submit = function(form) {
		console.log("submitting support ticket form ", arguments);
		$scope.triedSubmit = true;
		var params = angular.copy( $scope.values );
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
          .filter(function(pos) { return toastPos[pos]; })
          .join(' ');
		console.log('params are ', params);

		Backend.post("/supportTicket", params, true, true).then(function() {
			console.log("created ticket.");
			$mdToast.show(
			$mdToast.simple()
				.textContent('created ticket')
				.position(toastPosStr)
				.hideDelay(3000)
			);
			$state.go('support', {});
		$shared.endIsCreateLoading();
		});
	}

	$scope.load = function() {
      	$shared.isLoading = true;
		Backend.get("/supportTicket/categories").then(function(res) {
			var data = res.data;
			$scope.categories = data;
          	$shared.endIsLoading();
		});
	}
	$scope.load();
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SupportUpdateCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $mdDialog, $window, $stateParams, $sce) {
	$shared.updateTitle("Update Support ticket");
	$scope.$shared = $shared;
	$scope.values = {
		comment: ""
	};

	$scope.newUpdate = {
		comment: ""
	}

	$scope.submitUpdate = function(updateForm) {
		console.log("submitting support ticket form ", arguments);
		$scope.triedSubmit = true;
		var params = angular.copy( $scope.newUpdate );
        var toastPos = {
          bottom: false,
          top: true,
          left: false,
          right: true
        };
        var toastPosStr = Object.keys(toastPos)
          .filter(function(pos) { return toastPos[pos]; })
          .join(' ');
		console.log('params are ', params);
		var url = "/supportTicket/" + $scope.ticket.public_id +"/update";
		Backend.post(url, params, true, true).then(function() {
			console.log("sent support ticket update.");
			$mdToast.show(
			$mdToast.simple()
				.textContent('update submitted successfully')
				.position(toastPosStr)
				.hideDelay(3000)
			);
			//$state.go('support', {});
		$shared.endIsCreateLoading();
		// reload data
		load();
			});
	}
	function load() {
		var url = "/supportTicket/" + $stateParams['ticketId'];
		console.log("loading data")
		Backend.get(url).then(function(res) {
			console.log("ticket loaded.", res);
			var ticket = res.data;
			ticket.updates = ticket.updates.map((obj) => {
				obj.commentHTML = $sce.trustAsHtml(obj.comment);
				return obj;
			});
			$scope.ticket = ticket;
		});
	}
	load();
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('VerifiedCallerIdsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $http ) {
  $shared.updateTitle("Verified Caller IDs");
  $scope.Backend = Backend;
    function DialogController($scope, $mdDialog, Backend, $shared, onCreated) {
      $scope.$shared = $shared;
      $scope.error = false;
      $scope.errorText = "";
      $scope.$mdDialog = $mdDialog;
      $scope.countryCode = '';
      $scope.data = {
        step1: {
          number: "",
          notes: ""
        },
        step2:{
          code: ""
        }

      };
      $scope.step = 1;
      $http.get('../../scripts/constants/country-list.json').then(function(countries) {
        $scope.countries = countries.data;
      });
      $scope.postStep1 = function() {
        const data = angular.copy($scope.data.step1);
        data.number = $scope.countryCode + data.number;
        Backend.post("/settings/verifiedCallerIDs", data).then(function(res) {
          $scope.step = 2;
        });
      }

      $scope.onNumberChange = function() {
        $scope.data.step1.number = Number($scope.data.step1.number.replace(/[^0-9]/g, '').slice(0, 10));
        if (!$scope.data.step1.number) $scope.data.step1.number = '';
      }

      $scope.getMatchedCountry = function(text) {
        console.log('text', text);
        if (!text) return;
        const matchedCountry = $scope.countries.filter(country => country.name.toLowerCase().includes(text.toLowerCase()));
        console.log('matchedCountry', matchedCountry);
        return matchedCountry;
      }

      $scope.postStep2 = function() {
        var data = {
         'code': $scope.data.step2['code'],
         'number': $scope.data.step1['number']
        };
        Backend.post("/settings/verifiedCallerIDs/confirm", data).then(function(res) {
          var data = res.data;

          if (data.success) {

           $mdToast.show(
          $mdToast.simple()
            .textContent('Number verified')
            .position("top right")
            .hideDelay(3000)
        );

            $scope.close();
            onCreated();
          } else {
            $scope.error = true;
            $scope.errorText = "The code was invalid please try again.";
          }
        });

      }

      $scope.close = function() {
        console.log("closing dialog..");
        $mdDialog.hide();
      }
    }

  $scope.numbers = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/settings/verifiedCallerIDs/list").then(function(res) {
          $scope.numbers = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.createNumber = function($event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/dialogs/add-callerid.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        onCreated: function() {
          $scope.load();
        }

      }
    })
    .then(function() {
    }, function() {
    });
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('This will permantely remove the caller ID')
          .ariaLabel('Delete extension')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/settings/verifiedCallerIDs/" + number.public_id).then(function() {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('VerifiedCallerIdsCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared ) {
	  $shared.updateTitle("Verified Caller IDs");
   $scope.values = {
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
      $shared.isCreateLoading = true;
      Backend.post("/extension", values).then(function() {
       console.log("updated extension..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created extension')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('extensions', {});
        $shared.endIsCreateLoading();
      });
    }
  }
  $scope.keyupSecret = function() {
    var passwordRes = zxcvbn($scope.values.secret);
    //example 25%, 50%, 75%, 100%
    $scope.ui.secretStrength = ((passwordRes.score*25)).toString()+'%';
  }
  $timeout(function() {
    $shared.endIsLoading();
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceAPISettingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q) {
      $shared.updateTitle("Workspace API Settings");
      $scope.settings = {};
      $scope.load = function () {
        $shared.isLoading = true;
        return $q(function (resolve, reject) {
          Backend.get("/getWorkspaceTokens").then(function (res) {
            $scope.settings = res.data;
            $shared.endIsLoading();
            resolve();
          }, function () {
            reject();
          });
        });
      }
      $scope.refreshTokens = function ($event) {
        var confirm = $mdDialog.confirm()
          .title('Are you sure you want to refresh API tokens?')
          .textContent('if you are using these API tokens in any code the code will stop working and you will need to replace the API tokens with the new ones you create')
          .ariaLabel('Refresh tokens')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
        $mdDialog.show(confirm).then(function () {
            $shared.isLoading = true;
            Backend.get("/refreshWorkspaceTokens").then(function (res) {
              $scope.load().then(function () {
                $mdToast.show(
                  $mdToast.simple()
                  .textContent('API tokens recreated')
                  .position("top right")
                  .hideDelay(3000)
                );
              });
            });
          });
        }
        $scope.promptCopied = function () {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Copied to clipboard!')
            .position("top right")
            .hideDelay(3000)
          );

        }
        $scope.load();
      });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceParamCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Workspace Params");
  $scope.params = [];
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/workspaceParam/list").then(function(res) {
          $scope.params = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.saveParams = function() {
      var data = angular.copy($scope.params);
      Backend.post("/workspaceParam", data).then(function() {
          $mdToast.show(
          $mdToast.simple()
            .textContent('Workspace params saved successfully..')
            .position("top right")
            .hideDelay(3000)
        );
          });
  }
  $scope.addParam = function() {
    $scope.params.push({
      "key": "",
      "value": ""
    });
  }
  $scope.deleteParam = function(index, param) {
    $scope.params.splice(index, 1);
  }


  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Workspace Users");
  $scope.users = [];
  $scope.Backend = Backend;
  $scope.load = function() {
      $shared.isLoading = true;
      return $q(function(resolve, reject) {
        Backend.get("/workspaceUser/list").then(function(res) {
          $scope.users = res.data;
          $shared.endIsLoading();
          resolve();
        }, function() {
          reject();
        });
      });
  }
  $scope.deleteUser = function($event, user) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to remove this user from your workspace ?')
          .textContent('This will permantely remove the user from your workspace')
          .ariaLabel('Delete user')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
        $shared.isLoading = true;
      Backend.delete("/workspaceUser/" + user.public_id).then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('User deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          });

      })
    }, function() {
    });
  }
  $scope.resendInvite = function(user) {
    // Appending dialog to document.body to cover sidenav in docs app
      Backend.post("/workspaceUser/" + user.public_id + "/resendInvite").then(function() {
          $scope.load().then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Invite email sent..')
            .position("top right")
            .hideDelay(3000)
        );
          });
        });
  }
  $scope.editUser = function($event, user) {
    console.log("edit usr ", user);
    $shared.changeRoute('settings-workspace-users-edit', {userId: user.public_id});
  }
  $scope.createUser = function() {

    $shared.changeRoute('settings-workspace-users-create', {});
  }

  $scope.load();
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserAssignCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q, $stateParams ) {
    $shared.updateTitle("Create Extension");
    $scope.availableRoles = $shared.makeDefaultWorkspaceRoles(true);

  $scope.values = {
    user: {
      first_name: "",
      last_name: "",
      email: ""
    },
    roles: $shared.makeDefaultWorkspaceRoles(),
    preferred_pop: null,
    extension_id: null,
  };
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting workspace user form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {
        assign: {
          "extension_id": $shared.nullIfEmpty( $scope.values.extension_id ),
          "number_id": $shared.nullIfEmpty( $scope.values.number_id ),
          "preferred_pop": $shared.nullIfEmpty( $scope.values.preferred_pop ),
        }
      };
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
      $shared.isCreateLoading = true;
      Backend.post("/workspaceUser/" + $stateParams['userId'], values).then(function() {
       console.log("updated user..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Assigned user settings.')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('settings-workspace-users', {});
        $shared.endIsCreateLoading();
      });
    }
  }

  $scope.setupExtension = function($event) {
    $mdDialog.show({
      controller: SetupExtDialogController,
      templateUrl: 'views/dialogs/setup-ext.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "onSuccess": function(extId) {
          console.log("new extension is ", extId);
          $scope.extId = extId;
          load().then(function() {
            //console.log("selecting extension ID in dropdown")
            //$scope.values.extension_id = extId;
          });
        },
        "onError": function(flowId) {
          console.error("error occured..");
        }
      }
    })
    .then(function() {
    }, function() {
    });
  }

  $scope.setupNumber = function($event) {
    $mdDialog.show({
      controller: SetupNumberDialogController,
      templateUrl: 'views/dialogs/setup-number.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "onSuccess": function(numberId) {
          console.log("new number is ", numberId);
          $scope.numberId = numberId;
          load().then(function() {
            console.log('reloaded data successfully.');
          });

        },
        "onError": function(flowId) {
          console.error("error occured..");
        }
      }
    })
    .then(function() {
    }, function() {
    });
  }

  function load() {
    return $q(function(resolve, reject) {
      $q.all([
        Backend.get("/workspaceUser/" + $stateParams['userId']),
        Backend.get("/extension/list?all=1"),
        Backend.get("/did/list?all=1"),
        Backend.get("/getPOPs")
        ]).then(function(res) {
          var user = res.data;
          $scope.extensions = res[1].data.data;
          $scope.numbers = res[2].data.data;
          $scope.pops = res[3].data;
            console.log("$scope.values are ", $scope.values);
          angular.forEach($scope.extensions, function(ext) {
            if ( $scope.extId && $scope.extId === ext.public_id ) {
              $scope.values.extension_id = ext.id;
              $scope.extId = null;
            }
          });
          angular.forEach($scope.numbers, function(number) {
            if ( $scope.numberId && $scope.numberId === number.public_id ) {
              $scope.values.number_id = number.id;
              $scope.numberId = null;
            }
          });

          console.log("values are ", $scope.values);
          resolve();
        }, function() {
          reject();
        });
      });
    }

  load();

  $timeout(function() {
    $shared.endIsLoading();
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserCreateCtrl', function ($scope, Backend, $location, $state, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Create Extension");
    $scope.availableRoles = $shared.makeDefaultWorkspaceRoles(true);

  $scope.values = {
    user: {
      first_name: "",
      last_name: "",
      email: "",
      assigned_role_id: ""
    },
    roles: $shared.makeDefaultWorkspaceRoles()
  };
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting workspace user form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var values = {
        assigned_role_id: $scope.values.user.assigned_role_id,
        user: angular.copy($scope.values.user),
        roles: angular.copy($scope.values.roles)
      };
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
      $shared.isCreateLoading = true;
      Backend.post("/workspaceUser", values).then(function(res) {
       console.log("added user..");
       var id = res.headers('X-WorkspaceUser-ID');
        $mdToast.show(
          $mdToast.simple()
            .textContent('Added user to workspace')
            .position("top right")
            .hideDelay(3000)
        );
      $state.go('settings-workspace-users-assign', {
          userId: id
      });
        $shared.endIsCreateLoading();
      });
    }
  }

  // $scope.changeRole = function(value) {
  //   console.log(value)
  // }
  $timeout(function() {
    $q.all([
      Backend.get("/extension/list?all=1"),
      Backend.get("/did/list?all=1"),
      Backend.get("/workspaceUser/getWorkspaceRoles"),
    ]).then(function(res) {
      $shared.endIsLoading();
      $scope.extensions = res[0].data.data;
      $scope.numbers  = res[1].data.data;
      $scope.roleList  = res[2].data.roles;
      console.log("data ", res);
    });
  }, 0);

});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('WorkspaceUserEditCtrl', function ($scope, Backend, $location, $state, $stateParams, $mdDialog, $mdToast, $timeout, $shared, $q ) {
    $shared.updateTitle("Workspace User Edit");
    var roles = $shared.makeDefaultWorkspaceRoles();
    $scope.availableRoles = $shared.makeDefaultWorkspaceRoles(true);


  $scope.values = {
    user: {
      first_name: "",
      last_name: "",
      email: "",
      assigned_role_id: ""
    },
    preferred_pop: null,
    roles: $shared.makeDefaultWorkspaceRoles()
  };
  $scope.ui = {
    showSecret: false,
    secretStrength: 0
  }
  $scope.triedSubmit = false;
  $scope.submit = function(form) {
    console.log("submitting workspace user form ", arguments);
    $scope.triedSubmit = true;
    if (form.$valid) {
      var user = angular.copy($scope.values.user);
      // add assignment data
      var assign = {};
      assign['extension_id'] = $shared.nullIfEmpty( $scope.values['extension_id'] );
      assign['number_id'] = $shared.nullIfEmpty( $scope.values['number_id'] );
      var values = {
        assigned_role_id: $scope.values.user.assigned_role_id,
        user: user,
        roles: angular.copy($scope.values.roles),
        assign: assign
      };
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
      $shared.isCreateLoading = true;
      Backend.post("/workspaceUser/" + $stateParams['userId'], values).then(function() {
       console.log("added user..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('Added user to workspace')
            .position("top right")
            .hideDelay(3000)
        );
        $state.go('settings-workspace-users', {});
        $shared.endIsCreateLoading();
      });
    }
  }  
  
  $scope.setupExtension = function($event) {
    $mdDialog.show({
      controller: SetupExtDialogController,
      templateUrl: 'views/dialogs/setup-ext.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "onSuccess": function(extId) {
          console.log("new extension is ", extId);
          $scope.extId = extId;
          load();
        },
        "onError": function(flowId) {
          console.error("error occured..");
        }
      }
    })
    .then(function() {
    }, function() {
    });
  }

  $scope.setupNumber = function($event) {
    $mdDialog.show({
      controller: SetupNumberDialogController,
      templateUrl: 'views/dialogs/setup-number.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        "onSuccess": function(numberId) {
          console.log("new number is ", numberId);
          $scope.numberId = numberId;
          load();
        },
        "onError": function(flowId) {
          console.error("error occured..");
        }
      }
    })
    .then(function() {
    }, function() {
    });
  }

  function load() {
    $q.all([
      Backend.get("/workspaceUser/" + $stateParams['userId']),
      Backend.get("/extension/list?all=1"),
      Backend.get("/did/list?all=1"),
      Backend.get("/getPOPs"),
      Backend.get("/workspaceUser/getWorkspaceRoles"),
      ]).then(function(res) {
        $scope.values.user = res[0].data;
        for ( var index in $scope.values.roles ) {
          if ( $scope.values.user[ index ] ) {
            $scope.values.roles [ index ] = true;
          }
        }
        $scope.pops = res[3].data;
        $scope.roleList  = res[4].data.roles;
        $scope.values.extension_id = $scope.values.user.extension_id;
        $scope.values.number_id = $scope.values.user.number_id;
        $scope.values.preferred_pop = $scope.values.user.preferred_pop;
        $scope.extensions = res[1].data.data;
        $scope.numbers = res[2].data.data;
          console.log("$scope.values are ", $scope.values);
          console.log("$scope.extensions are ", $scope.extensions);
        angular.forEach($scope.extensions, function(ext) {
          if ( $scope.extId && $scope.extId === ext.public_id ) {
            $scope.values.extension_id = ext.id;
          }
        });
        angular.forEach($scope.numbers, function(number) {
          if ( $scope.numberId && $scope.numberId === number.public_id ) {
            $scope.values.number_id = number.id;
          }
        });

        console.log("values are ", $scope.values);
      });
    }

  load();

  $timeout(function() {
    $shared.endIsLoading();
  }, 0);
});


'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('BodyCtrl', function ($scope, $shared) {
  $scope.$shared = $shared;
});
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('cardCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ChartCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular
    .module('Lineblocs')
    .controller('calendarCtrl', function ($scope) {
    });
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
 angular.module('Lineblocs').controller('componentCtrl', function ($scope, $interval, $mdToast, $document) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('DashboardCtrl', function($scope, $state, $rootScope, $translate, $timeout, $window, $shared, Backend, ThemeService) {
	$scope.$shared = $shared;

  	$scope.$state = $state;


  	$rootScope.$on('$stateChangeSuccess', function(){
		$timeout(function() {
			$('body').scrollTop(0);
		}, 200);
	});

  $scope.searchText = '';
  $scope.searchSection = function() {
    Backend.get("/search?query="+ $scope.searchText).then(function(res) {
      $scope.totalResults = res.data.categories;
      getMatchingItems();
    });
  };

  function getMatchingItems() {
    if (!$scope.totalResults || !$scope.totalResults.length) return [];
    for (const value of $scope.totalResults) {
      value.key = value.key.replace(/_/g, ' ')
      value.results = value.results.slice(0, 5);
    }
    $scope.searchResults = $scope.totalResults;
  };

  $scope.onOutsideClick = function() {
    console.log('outside click');
    $scope.searchText = '';
    $scope.totalResults = [];
  };

  $scope.selectedItemChange = function(item, type) {
    $scope.searchText = item.title;
    $scope.totalResults = [];
    if (type && type === 'resource articles') {
      window.open(item.url, '_blank');
    } else {
      if (item && item.ui_identifier) $state.go(item.ui_identifier, {});
    }
  }

  $scope.clearSearch = function() {
    $scope.searchText = '';
    $scope.totalResults = [];
  }

  document.addEventListener('click', function(event) {
    if (document.getElementById('search-section-global') && !document.getElementById('search-section-global').contains(event.target)) {
      $scope.totalResults = [];
      $scope.$apply();
    }
  });

  	if ($('body').hasClass('extended')) {
	  	$timeout(function(){
			//$('.sidebar').perfectScrollbar();
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
			//$('.sidebar').perfectScrollbar();
			console.log('pfscroll');
		}, 200);
	}





	$scope.changeTheme = function(setTheme){
		const themeMap = {
			'light': 'blue',
			'dark': 'blue'
		}

		$('<link>')
		  .appendTo('head')
		  .attr({type : 'text/css', rel : 'stylesheet'})
		  .attr('href', 'styles/app-'+themeMap[setTheme]+'.css');
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

	/*
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
		*/

	$scope.changeLanguage = (function (l) {

		$translate.use(l);

	});

	loadAddedResources1();
});

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('ForgotCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle) {
	  $shared.updateTitle("Forgot Password");
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
			var resetMsg = ""
			Backend.post("/account/forgotPassword", data, true).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
				$shared.showMsg('Reset instructions', 'We have sent you instructions to reset your password');
/*
					$mdToast.show(
					$mdToast.simple()
						.textContent('Reset instructions sent to email..')
						.position("top right")
						.hideDelay(3000)
					);
					*/
			}).catch(function() {
				$scope.isLoading = false;
				$scope.errorMsg = "No such user exists.";
			})
			return;
		}
	}
	$scope.gotoLogin= function() {
		$shared.changingPage = true;
		$shared.scrollToTop();
    	$state.go('login');
	}
	$shared.changingPage = false;
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HeadCtrl', function ($scope, $shared) {
  $scope.$shared = $shared;
});
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('HomeCtrl', ['$scope', '$timeout', 'Backend', '$shared', '$q', '$sce', '$state', function ($scope, $timeout, Backend, $shared, $q, $sce, $state) {
	  $shared.updateTitle("Dashboard");

	$scope.$shared = $shared;
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
			$shared.isLoading = true;
			Backend.get("/dashboard").then(function(res) {
				var graph = res.data[0];
				$shared.billInfo=  res.data[1];
				$shared.userInfo=  res.data[2];
				console.log("graph data is ", graph);
				$scope.callsMade = [
					{
						name: "Call 1",
						callerName: "XYZ caller",
						fromNumber: "9876543210",
						toNumber: "1234567890",
						exten: "Ext 1",
						img: "logo-icon.png",
						duration: "25m: 20sec",
						date:"1 days before",
					},
					// {
					// 	name: "Call 2",
					// 	callerName: "ABC caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 2",
					// 	img: "Logo_Final_Icon_White.png",
					// 	duration: "1h: 5m: 10sec",
					// 	date:"2 days before",
					// },
					// {
					// 	name: "Call 3",
					// 	callerName: "QWE caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 3",
					// 	img: "logo-icon.png",
					// 	duration: "5m: 40sec",
					// 	date:"3 days before",
					// }
				];
				$scope.callsIncoming = [{
					name: "Call 1",
					callerName: "XYZ caller",
					fromNumber: "9876543210",
					toNumber: "1234567890",
					exten: "Ext 1",
					img: "logo-icon.png",
					duration: "25m: 20sec",
					date:"1 days before",
				},
					// {
					// 	name: "Call 2",
					// 	callerName: "ABC caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 2",
					// 	img: "Logo_Final_Icon_White.png",
					// 	duration: "1h: 5m: 10sec",
					// 	date:"2 days before",
					// },
					// {
					// 	name: "Call 3",
					// 	callerName: "QWE caller",
					// 	fromNumber: "9876543210",
					// 	toNumber: "1234567890",
					// 	exten: "Ext 3",
					// 	img: "logo-icon.png",
					// 	duration: "5m: 40sec",
					// 	date:"3 days before",
					// }
				]
				$scope.DIDPurchased = [
					{
						DIDNumber:"8882229990",
						region: "Region Two"
					},
					// {
					// 	DIDNumber:"7766554433",
					// 	region: "ABC"
					// },
					// {
					// 	DIDNumber:"0011223344",
					// 	region: "QWE"
					// },
				];
				$scope.DIDRenewed = [
					{
						DIDNumber:"8882229990",
						region: "Region One"
					},
					// {
					// 	DIDNumber:"7766554433",
					// 	region: "ABC"
					// },
					// {
					// 	DIDNumber:"0011223344",
					// 	region: "QWE"
					// },
				];
				$scope.recordings = [
					{
						record: "value11",
						from: "7678687687",
						to: "6655441488"
					},
					// {
					// 	record: "value22",
					// 	from: "0099887767",
					// 	to: "98787"
					// },
					// {
					// 	record: "value33",
					// 	from: "8765432876",
					// 	to: "0941526790"
					// },
				];
				$shared.isLoading = false;
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
						}],
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

	$scope.getFeed = function(){
		Backend.get("/feed").then(function(res) {
			//$scope.feeds = res.data.items;
			$scope.feeds = res.data.items.map(function(obj) {
				if(obj.event_type === 'recordings' || obj.s3_url !== undefined){
					obj['public_url'] = $sce.trustAsResourceUrl(obj.s3_url);
					
				}
				return obj;
				});
		});
	}
	$scope.gotorecoring = function() {
		$state.go('recordings');
	}
	$scope.gotodid = function(feed) {
		// $state.go('dids/my-numbers/'+feed.public_id+'/edit');
		$state.go('my-numbers-edit', { numberId: feed.public_id });
	}
	$scope.reloadGraph = function() {
		console.log("reloadGraph called..");
		$scope.load();
	}
	$scope.load();
	$scope.getFeed();
}]);
'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('JoinWorkspaceCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $stateParams, Idle) {
	  $shared.updateTitle("Join Workspace");
	  var hash = $stateParams['hash'];
	  $scope.passwordSet = false;
	  $scope.values = {
		  "first_name": "",
		  "last_name": "",
		  "password": "",
		  "password2": ""
	  };
	function finishLogin(token, workspace) {
		console.log("finishLogin ", arguments);
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				$shared.isAdmin = token.isAdmin;

				$shared.setAuthToken(token);
				$shared.setWorkspace(workspace);
				Idle.watch();
				$state.go('dashboard-user-welcome', {});
	}

	$scope.submit =function($event, inviteForm) {
		if (!inviteForm.$valid) {
			$scope.triedSubmit = true;
			$scope.errorMsg = "Please fill in all fields below..";
			return;
		}
		if ($scope.values.password !== $scope.values.password2) {
			$scope.errorMsg = "Passwords don't match";
			return;


		}
		var data = {
			"hash": $stateParams['hash'],
			"first_name": $scope.values['first_name'],
			"last_name": $scope.values['last_name'],
			"password": $scope.values['password']
		};
		Backend.post("/submitJoinWorkspace", data).then(function(res) {
			$scope.isLoading = true;
			var token = res.data;
			console.log("token is ", token);
			finishLogin(token, res.data.workspace);
		});
	}
	$scope.acceptInvite = function() {
			var data = {
			"hash": $stateParams['hash']
		};
			$scope.isLoading = true;
		Backend.post("/acceptWorkspaceInvite", data).then(function(res) {
			var token = res.data;
				finishLogin(token, res.data.workspace);
		});
	}

	  Backend.get("/fetchWorkspaceInfo?hash=" +hash).then(function(res) {
		  $scope.info = res.data;
		  if ( $scope.info.user.needs_password_set ) {
			  $scope.passwordSet = true;
		  }
	  });
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('LoginCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, Idle, $interval, $window) {
  $shared.updateTitle("Login");
  $shared.processResult();
	$scope.triedSubmit = false;
	$scope.couldNotLogin = false;
  $scope.invalideOtp = false;
	$scope.noUserFound = false;
	$scope.shouldSplash = false;
	$scope.isLoading = false;
	$scope.challenge = null;
	$scope.user = {
		email: "",
		password: "",
    otp:"",
	};
	$scope.step = 1;
  $scope.countdownDuration = 5;
  $scope.resendTimeout = $scope.countdownDuration * 60;
  $scope.timerDisplay = padZero(Math.floor($scope.resendTimeout / 60)) + ':' + padZero($scope.resendTimeout % 60);
  var clickedGoogSignIn = false;
  var countdown;
  $scope.selectedTheme = localStorage.getItem("THEME");

  $scope.theme = {
    default: 'styles/app-blue.css',
    dark: 'styles/app-grey.css',
    light: 'styles/app-cyan.css',
  }

  $scope.changeTheme = function(theme){
    $window.localStorage.setItem('THEME', theme);
    $scope.selectedTheme = theme;
  }
  function addStyle(path) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  }

  function removeStyle(selectedPath) {
    const allLinks = ['styles/app-grey.css', 'styles/app-blue.css', 'styles/app-green.css', 'styles/app-red.css', 'styles/app-purple.css', 'styles/app-cyan.css' ]
    const links = document.head.querySelectorAll('link[href]');
    for (var i = 0; i < links.length; i++) {
      const path = links[i].getAttribute('href');
      if (!allLinks.includes(path)) continue;
      if (path === selectedPath) continue;
      document.head.removeChild(links[i]);
    }
  }

function startCountdown() {
  countdown = $interval(function() {
    var minutes = Math.floor($scope.resendTimeout / 60);
    var seconds = $scope.resendTimeout - minutes * 60;
    $scope.resendTimeout--;
    if ($scope.resendTimeout < 0) {
      $interval.cancel(countdown);
    }
    $scope.timerDisplay = padZero(minutes) + ':' + padZero(seconds);
  }, 1000);
}

startCountdown();
function padZero(number) {
  return (number < 10 ? '0' : '') + number;
}
const code = $location.search().code;
if (code) {
  fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: $shared.frontend_api_creds.apple_signin_client_id,
      client_secret:  $shared.frontend_api_creds.apple_signin_client_secret,
      redirect_uri: 'https://your-app.com/callback',
    }),
  }).then(response => response.json()).then(data => {
    const loginOption = {
      provider    : 'apple',
      id_token    : data.access_token,
      access_token: data.access_token,
    };
    $scope.startThirdPartyLogin( user.email, user.displayName, '', '', loginOption);
  })
  .catch(error => {
    // Handle the error
  });
}

function redirectUser() {
  Backend.post("/updateSelf", { theme: $scope.selectedTheme }).then(function(res) {
    addStyle($scope.theme[$scope.selectedTheme]);
    removeStyle($scope.theme[$scope.selectedTheme]);
  });
		Idle.watch();
		var hash = window.location.hash.substr(1);
		var query = URI(hash).query(true);
		if ( query.next ) {
				window.location.replace("#/" + query.next);
				return;
		}
		$state.go('dashboard-user-welcome', {});
}
	function finishLogin(data) {
		console.log("finishLogin ", arguments);
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				$shared.isAdmin = data.isAdmin;

				$shared.setAuthToken(data);
				$shared.setWorkspace(data.workspace);
				if (!$shared.isAdmin) {
					redirectUser();
					return;
				}
				$shared.isAdmin = true;
				$shared.setAdminAuthToken(data.adminWorkspaceToken);
        Backend.post("/updateSelf", { theme: $scope.selectedTheme }).then(function(res) {
          addStyle($scope.theme[theme]);
          removeStyle($scope.theme[theme]);
        });
				Backend.get("/admin/getWorkspaces").then(function(res) {
					$shared.workspaces = res.data.data;
					$state.go('dashboard-user-welcome', {});
				});
	}

  // Apple Login ==============================================================
  $scope.loginWithApple = function () {
    console.log("loginWithApple", AppleID);
    AppleID.auth.signIn();
  }


  // Microsoft login ===========================================================
  $scope.loginWithMicrosoft = function () {

    const msalConfig = {
      auth: {
          // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
          clientId: $shared.frontend_api_creds.msft_signin_client_id || "3a49ca34-f4b5-40b3-a8bc-27ed569d7867",
          // Full directory URL, in the form of https://login.microsoftonline.com/<tenant-id>
          authority: "https://login.microsoftonline.com/common",
          // Full redirect URL, in form of http://localhost:3000
          redirectUri: DEPLOYMENT_DOMAIN,
      },
      cache: {
          cacheLocation: "sessionStorage", // This configures where your cache will be stored
          storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
      },
      system: {
          loggerOptions: {
              loggerCallback: (level, message, containsPii) => {
                console.log("loggerCallback", level);
                  if (containsPii) {
                      return;
                  }
                  switch (level) {
                      case msal?.LogLevel?.Error:
                          console.error(message);
                          return;
                      case msal?.LogLevel?.Info:
                          console.info(message);
                          return;
                      case msal?.LogLevel?.Verbose:
                          console.debug(message);
                          return;
                      case msal?.LogLevel?.Warning:
                          console.warn(message);
                          return;
                  }
              }
          }
      }
    };

    const myMSALObj = new msal.PublicClientApplication(msalConfig);
    myMSALObj.loginPopup({scopes: ["User.Read"]}).then(handleResponse)
      .catch(error => {
          console.error(error);
      });
  }

  function handleResponse(response) {
    if (response === null) return;
    const loginOption = {
      provider    : 'microsoft',
      id_token    : response.idToken,
      access_token: response.accessToken,
    };
    $scope.startThirdPartyLogin( response.account.userName, response.account.name, '', '', loginOption);
  }

  $scope.validateEmail = function($event, loginForm) {
		$scope.triedSubmit = true;
		if (!loginForm.$valid) {

			$scope.errorMsg = "Please enter a valid email";
			return;
		}
			$shared.changingPage = true;
			Backend.get("/getUserInfo?email=" + $scope.user.email).then(function( res ) {
				$shared.changingPage = false;
				if ( res.data.found ) {
					$scope.userInfo = res.data.info;
					$scope.step = 2;
					return;
				}
				$scope.noUserFound = true;
			});
	}

  $scope.validatePassword = function($event, loginForm) {
    if (!loginForm.$valid) {
      return;
    }
    const data = angular.copy($scope.user);
    data['challenge'] = $scope.challenge;
    $scope.isLoading = true;
    Backend.post("/jwt/authenticate", data, true).then(function (res) {
      if (res.data.enable_2fa === true) {
        $scope.requestOtp($event, loginForm);
      } else {
        finishLogin(res.data);
      }
    }).catch(function () {
      $scope.isLoading = false;
      $scope.couldNotLogin = true;
    })
	}

  $scope.requestOtp = function($event) {
    $scope.isLoading = true;
    $scope.resendTimeout = $scope.countdownDuration * 60;
    $scope.timerDisplay = padZero(Math.floor($scope.resendTimeout / 60)) + ':' + padZero($scope.resendTimeout % 60);
    $interval.cancel(countdown);
    startCountdown();
    Backend.get("/request2FACode", {params: {email: $scope.user.email, password: $scope.user.password}}).then(function( res ) {
      $scope.isLoading = false;
      $scope.step = 3;
    }).catch(function() {
      $scope.step = 3;
      $scope.isLoading = false;
      $scope.couldNotLogin = true;
    })
  }

  $scope.validateOtp = function ($event, loginForm) {
    $scope.triedSubmit = true;
    if (!loginForm.$valid) {
      return;
    }
    $scope.isLoading = true;
    $scope.invalideOtp = false;
    Backend.post("/verify2FACode", {
      "email": $scope.user.email,
      "password": $scope.user.password,
      "2fa_code": $scope.user.otp
    }).then(function( res ) {
      $scope.isLoading = false;
      console.log("res", res);
      if (res.data.success) {
        finishLogin(res.data);
      } else {
        $scope.invalideOtp = true;
        $scope.$apply();
      }
    }).catch(function() {
      $scope.isLoading = false;
      $scope.couldNotLogin = true;
    })
  }

  $scope.requestAssistant = function() {
    window.open(`https://${DEPLOYMENT_DOMAIN}/resources/other-topics/2fa-verification-support`, '_blank');
  }

	$scope.gotoRegister = function() {
		$shared.changingPage = true;
		$shared.scrollToTop();
    	$state.go('register');
	}
	$scope.gotoForgot = function() {
		$shared.changingPage = true;
		$shared.scrollToTop();
		$state.go('forgot');
	}

	$scope.startThirdPartyLogin = function(email, firstname, lastname, avatar, loginOption) {
		var data = {};
		data['email'] = email;
		data['first_name'] = firstname;
		data['last_name'] = lastname;
		data['avatar'] = avatar;
		data['challenge'] = $scope.challenge;
    data['login_option'] = loginOption;
			$shared.changingPage = true;
		Backend.post("/thirdPartyLogin", data).then(function( res ) {
			$timeout(function() {
				$scope.$apply();
				$shared.scrollToTop();

				if ( res.data.confirmed ) {
					finishLogin(res.data);
					return;
				}
				$state.go('register', {
					"hasData": true,
					"userId": res.data.userId,
					"authData": {"token": res.data.info.token}
				});
			}, 0);
		});
	}

	function renderButton() {
      gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 400,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
		'onsuccess': function(googleLoginResponse) {
				if (!clickedGoogSignIn) {
					return;
				}
				var profile = googleLoginResponse.getBasicProfile();
				console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
				console.log('Name: ' + profile.getName());
				console.log('Image URL: ' + profile.getImageUrl());
				console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
				var ctrl= angular.element("body").scope();
				var fullName = profile.getName().split(' '),
    				firstName = fullName[0],
    				lastName = fullName[fullName.length - 1];
        const { id_token, access_token } = googleLoginResponse.getAuthResponse();
        const loginOption = {
          provider: 'google',
          id_token,
          access_token,
        }
				$scope.startThirdPartyLogin( profile.getEmail(), firstName, lastName, profile.getImageUrl(), loginOption);
			},
			onerror: function(err) {
			console.log('Google signIn2.render button err: ' + err)
			},
        'onfailure': function() {
			console.error("failure ", arguments);
		}
	  });
    }

	$scope.backStep1 = function() {
		$scope.step = 1;
	}
	$shared.changingPage = false;
	angular.element("#gSignIn").on("click", function() {
		clickedGoogSignIn = true;
	});
	var full = window.location.host
	//window.location.host is subdomain.domain.com
	var parts = full.split('.')
	var sub = parts[0]
	var second = sub.split(":");
	if (sub !== 'app' && second[0] !== 'localhost' && parts[1] !== 'ngrok') {
		$scope.challenge = sub;
	}
	$timeout(function() {
		renderButton();
	}, 0);
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

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

angular.module('Lineblocs').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('NotFoundCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $window, Idle) {
	  $shared.updateTitle("404 Not Found");
	  $scope.goBack = function() {
         $window.history.back();
	  }
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('WorkspaceOptionsCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast) {
	  $shared.updateTitle("Workspace Options");
	  $scope.triedSubmit = false;
	  $scope.ui = {
	  };
	$scope.workspace = {
		byo_enabled: null,
		outbound_macro_id: null
	};
    $scope.submitSettings = function($event, settingsForm) {
		$scope.triedSubmit = true;
		console.log("submit ", arguments);
		if (settingsForm.$valid) {
			var data = {};
			data['byo_enabled'] = $scope.workspace.byo_enabled;
			data['outbound_macro_id'] = $scope.workspace.outbound_macro_id;
			Backend.post("/updateWorkspace", data).then(function( res ) {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your info')
						.position("top right")
						.hideDelay(3000)
					);
					$shared.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}
	$scope.changeOutbound = function(value) {
		console.log("changeFunction  ", arguments);
		$scope.workspace.outbound_macro_id = value;
	}
	$shared.isLoading = true;
	$q.all([
		Backend.get("/workspace"),
		Backend.get("/function/list?all=1")
	]).then(function(res) {
		$scope.workspace = res[0].data;
		console.log("workspace is ", $scope.workspace);
		$scope.functions = res[1].data.data;
		$shared.endIsLoading();
	});
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('PaginationDemoCtrl', function ($scope, $log) {
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
 * @name Lineblocs.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('paperCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('piechartCtrl', ['$scope', function ($scope) {
   
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
 angular.module('Lineblocs').controller('profileCtrl', function ($scope) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('ProgressDemoCtrl', function ($scope) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
var paypal;
var count = 0;
angular.module('Lineblocs')
  .controller('RegisterCtrl', function($scope, $compile, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle, $stateParams, $mdDialog, $filter) {
	  $shared.updateTitle("Register");
		console.log("STATE ", $stateParams);

	var stripeElements;
	var stripeCard;
	var stripe;
	  var countryToCode = {
		  US: "+1",
		  CA: "+1",
	  };
	  $scope.acceptTerms =true;
	  $scope.triedSubmit = false;
	  $scope.passwordsDontMatch = false;
	  $scope.shouldSplash = false;
	  $scope.didVerifyCall = false;
	  $scope.step = 1;
	  $scope.userId = null;
	  $scope.token = null;
	  $scope.invalidCode =false;
	  $scope.invalidNumber =false;
	  $scope.paymentErrorMsg = null;
	  $scope.planInfo = null;
    $scope.planPrice = null;
	$scope.hasWorkspaceNameErr = false;
	$scope.user = {
		first_name: "",
		last_name: "",
    mobile_number: "",
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
	$scope.query = {
		question_id: "",
		response: ""
	};
  $scope.paymentDetails = {
    payment_card: {
      payment_card_number: "",
      expiration_date: "",
      security_code: "",
      cardholder_name: ""
    },
    paypal: {
      name: "",
    },
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      postal_code: "",
    },
    accept_terms: false,
  };
	$scope.card = {
		number: "",
		cvv: "",
		expires: "",
		name: "",
	};
  $scope.paymentMethods = '';
  $scope.cardVisible = true;
  $scope.paypalVisible = false;
  $scope.paypalLoaded = false;
  const currentDate = new Date();
  const trialDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
  $scope.nextTrialDate = $filter('date')(trialDate, 'MMM dd, yyyy');
  $scope.chargeCurrentDate = $filter('date')(new Date(), 'MMM dd, yyyy');
  $scope.qIndex = 0;


  $scope.displayCard = function() {
    $scope.cardVisible = true;
    $scope.paypalVisible = false;
    $scope.paymentForm.$setPristine();
    $scope.paymentForm.$setUntouched();
  };

  $scope.displayPaypal = function() {
    $scope.cardVisible = false;
    $scope.paypalVisible = true;
    $scope.paymentForm.$setPristine();
    $scope.paymentForm.$setUntouched();
    renderPaypalButton();
  };

  $scope.workspace = "";
  $scope.selectedTemplate = null;

  $scope.onNumberChange = function() {
	if(!$scope.user.mobile_number) return;
    $scope.user.mobile_number = Number($scope.user.mobile_number.replace(/[^0-9]/g, '').slice(0, 10)); 
    if (!$scope.user.mobile_number) $scope.user.mobile_number = '';
  }

  $scope.cardNumberChange = function() {
    if (!$scope.paymentDetails || !$scope.paymentDetails.payment_card) return;
    if (!$scope.paymentDetails.payment_card.payment_card_number) return;
    $scope.paymentDetails.payment_card.payment_card_number = Number($scope.paymentDetails.payment_card.payment_card_number.replace(/[^0-9]/g, '').slice(0, 16));
    if (!$scope.paymentDetails.payment_card.payment_card_number) $scope.paymentDetails.payment_card.payment_card_number = '';
  }

  $scope.onSecurityCode = () => {
    if (!$scope.paymentDetails || !$scope.paymentDetails.payment_card) return;
    if (!$scope.paymentDetails.payment_card.security_code) return;
    $scope.paymentDetails.payment_card.security_code = Number($scope.paymentDetails.payment_card.security_code.replace(/[^0-9]/g, '').slice(0, 4));
    if (!$scope.paymentDetails.payment_card.security_code) $scope.paymentDetails.payment_card.security_code = '';
  }

  const patterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
  };
  const logos = {
    visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/40px-Visa_Inc._logo.svg.png',
    mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/40px-Mastercard-logo.svg.png',
    amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/40px-American_Express_logo.svg.png',
    discover: 'https://www.duplichecker.com/newassets1/images/cradit-card-validator/Discover.svg'
  };

	$scope.needsCustomPaymentForm = function() {
		return false;
	}
  $scope.getCreditCardBrand = function (cardNumber) {
    if (!cardNumber) return null;
    cardNumber = cardNumber.toString().replace(/\D/g, '');

    for (const brand in patterns) {
      if (!patterns[brand].test(cardNumber)) continue;
      return {
        brand: brand,
        logo: logos[brand]
      };
    }
    return null;
  }
  $scope.changeCountry = function (country) {
    $scope.paymentDetails.address.country = country;
  }
  $scope.changeState = function (state) {
    $scope.paymentDetails.address.state = state;
  }
  $scope.checkoutTrial = function() {
    $scope.step = 6;

  }

  $scope.checkoutDashboard = function() {
    doSpinup();
  }

  $scope.validateExpirationDate = function(value) {
    if (!value) return true;
    value = value.replace(/[^0-9/]/g, '');
    let parts = value.split('/');
    if (parts[0].length > 2) parts[0] = parts[0].slice(0, 2);
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].slice(0, 2);
    $scope.paymentDetails.payment_card.expiration_date = parts.join('/');
    if (parts[0].length === 2 && parts.length === 1 && $scope.prevExpiry !== value + '/') {
      $scope.paymentDetails.payment_card.expiration_date = value + '/';
    }
    $scope.prevExpiry = $scope.paymentDetails.payment_card.expiration_date;
    if (parts[0] > 12 || parts[0] < 1 || parts[1] < 0 || parts[1] > 99) return false;
    let expirationDate = new Date('20' + parts[1], parts[0] - 1, 1);
    let currentDate = new Date();
    let lastDayOfMonth = new Date(expirationDate.getFullYear(), expirationDate.getMonth() + 1, 0).getDate();
    expirationDate.setDate(lastDayOfMonth);
    return expirationDate >= currentDate;
  };


  function doSpinup() {
	$scope.shouldSplash = true;
	$shared.setAuthToken( $scope.token );
	var data = { "userId": $scope.userId, "plan": $scope.plan.key_name };
	console.log("do spinup data ", data);
	$scope.invalidCode = false;
	$shared.changingPage = true;
	Backend.post("/userSpinup", data).then(function( res ) {
		var data = res.data;
		if ( data.success ) {

			Idle.watch();
			$shared.setAuthToken($scope.token);
			$shared.setWorkspace(res.data.workspace);
			$shared.changingPage = false;
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

  	$scope.gotoVerificationFlow = function() {
				var verficationWorkflow = $shared.customizations['verification_workflow'];
				if ( verficationWorkflow === 'sms' ) {
					$scope.step = 2;
				} else {
					$scope.step = 3;
				}
	}

	$scope.needsCustomPaymentForm = () => {
		return false;
	}

  	$scope.gotoPaymentForm= function() {
		console.log('gotoPaymentForm called')
		$scope.step = 6;
  		initializePaymentGateway().then(() => {
			setTimeout(() => {
				setupStripeElements();
			}, 0);
		});
	}
    $scope.submit = function($event, registerForm) {
		console.log("called submit");
		$scope.triedSubmit = true;
		console.log("data is ", $scope.user);
		console.log("form ", registerForm);
		if (!$scope.acceptTerms) {
			$scope.triedSubmit = true;
			$scope.didNotAcceptTerms = true;
			return;
		}
		if ($scope.user.password !== $scope.user.password2) {
			$scope.passwordsDontMatch = true;
			return;
		} else {
			$scope.passwordsDontMatch = false;
		}
		if (registerForm.$valid) {
			var data = angular.copy( $scope.user );
				$shared.changingPage = true;
			Backend.post("/register", data).then(function( res ) {
				var data = res.data;
				if ( !data.success ) {
					$shared.showError("Error", data.message);
					return;
				}
				$scope.token = data;
				$scope.userId = data.userId;
				$scope.workspaceInfo = data.workspace;
				$shared.changingPage = false;

				$scope.gotoVerificationFlow();
			});
			return;
		}
      	return false;

	}

	$scope.submitQuestion = function(event, form, id) {
		if($scope.qIndex !== $scope.registrationQuestions.length-1){
			$scope.qIndex++;
			$scope.width = ((($scope.qIndex+1) / $scope.registrationQuestions.length) * 100).toString() + '%';
			console.log($scope.width)
			if($scope.width === '100%'){
				$scope.brdr = '20px';
			}
		} else{
			resObj = {};
			resObj.responses = [];
			resObj.user_id = $scope.userId;
			for(var q=0; q<$scope.registrationQuestions.length; q++){
				if($scope.registrationQuestions[q].response !== undefined){
					resObj.responses.push({
						question_id: $scope.registrationQuestions[q].id, 
						response: $scope.registrationQuestions[q].response
					})
				}
			}
			console.log(resObj);
			Backend.post("/saveRegistrationQuestionResponses", resObj).then(function( res ) {
				if (res.data.success) {
					$scope.step = 5;
					return;
				}
			});
			return;
		}
	
	}

  $scope.selectPaymentMethod = function(method) {
    $scope.paymentMethod = method;
  };


  function isPaymentFormValid() {
    //return paymentForm.$valid;
	return true;
  }
  $scope.submitPaymentForm = function($event, paymentForm) {
    console.log("called click PaymentForm");
    $scope.triedSubmit = true;
    if(!$scope.paymentDetails.accept_terms) return;
    if(isPaymentFormValid()) {
      if($scope.paymentMethod === 'card') {
        submitTrial();
        // $scope.step = 6;
        return;
      } else {
		$scope.gotoPaymentForm();
      }
    }
  }

  async function submitTrial() { 
	const paymentMethod = await createPaymentMethod();
    const data = {};
    const billingAddress = {
      'addr1': $scope.paymentDetails.address.street,
      'addr2': $scope.paymentDetails.address.street,
      'country': $scope.paymentDetails.address.country.name,
      'zipcode': $scope.paymentDetails.address.postal_code,
    };
    data['payment_gateway'] = $shared.customizations.payment_gateway;
    data['billing_region_id'] = $scope.paymentDetails.address.state.id;
    data['billing_address'] = billingAddress;
    data['payment_card'] = $scope.paymentDetails.payment_card;
    data['user_id'] = $scope.userId;
    data['workspace_id'] = $scope.workspaceInfo.id;
    data['payment_values'] = {};
	const paymentData = {};
	paymentData['payment_method_id'] = paymentMethod.id;
	paymentData['last_4'] = paymentMethod.card.last4;
	paymentData['issuer'] = paymentMethod.card.brand;
	data['payment_values'] = paymentData
    Backend.post("/saveCustomerPaymentDetails", data, true).then(function( res ) {
      console.log('saved payment details', res);
      $scope.step = 7;
    }).catch(function(err) {
      console.log('error saving payment details', err);

	  showPaymentError("Internal error occured. Please contact support.");
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

function showPaymentError(msg) {
	// Show the errors on the form
	$scope.paymentErrorMsg = msg;
	angular.element('#paymentForm').scrollTop(0)
}

function setupStripeElements() {
	console.log('setupStripeElements called');
	// Create an instance of Elements.
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

  async function createCardToken(gateway, paymentDetails) {
    try {
      switch (gateway) {
        case 'stripe': {
          const expiry = paymentDetails.payment_card.expiration_date.split('/');
          const cardDetails = {
            number: paymentDetails.payment_card.payment_card_number,
            exp_month: expiry[0],
            exp_year: expiry[1],
            cvc: paymentDetails.payment_card.security_code,
            name: paymentDetails.payment_card.cardholder_name,
            address_line1: paymentDetails.address.street,
            address_city: paymentDetails.address.city,
            address_state: paymentDetails.address.state.name,
            address_zip: paymentDetails.address.postal_code,
            address_country: paymentDetails.address.country.name,
          };
          const response = await Stripe.card.createToken(cardDetails);
          return {card_token: response.id, last_4: response.card.last4};
        }
      }
    } catch (err) {

    }
  }


	$scope.submitVerify1Form = function($event, verify1Form) {
		console.log("called submitVerify1Form");
		$scope.triedSubmit = true;
		if (verify1Form.$valid) {
			var data = {};
			data.mobile_number = countryToCode[$scope.verify1.country] + $scope.verify1.mobile_number;
			data.userId = $scope.userId;
				$shared.changingPage = true;
			Backend.post("/registerSendVerify", data).then(function( res ) {
				var data = res.data;
				$shared.changingPage = false;
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
				$shared.changingPage = true;
			Backend.post("/registerVerify", data).then(function( res ) {
				var isValid = res.data.isValid;
				$shared.changingPage = false;
				if (isValid) {
					var email = $scope.user.email;
					var splitted = email.split("@");
					$scope.workspace = $shared.cleanWorkspaceName(splitted[0]);
					$scope.step = 3;
				} else {
					$scope.invalidCode = true;
				}
			});
			return;
		}
		return false;
	}

	function checkWorkspaceName(name) {
		if (name !== name.toLowerCase()) {
			return false;
		}
		if (!name.match(/^[a-z0-9\-]+$/)) {
			return false;
		}
		return true;
	}
	$scope.submitBillingForm = function($event, billingForm) {

		//setup tokens for workspace access
		$shared.setAuthToken($scope.token);
		$shared.setWorkspace($scope.workspace);


			var data = {};
			data['number'] = $scope.card.number;
			data['cvc'] = $scope.card.cvv;
			var splitted = $scope.card.expires.split("/");
			data['exp_month'] = splitted[ 0 ];
			data['exp_year'] = splitted[ 1 ];
			data['address_zip'] = $scope.card.postal_code;
			Stripe.card.createToken(data, stripeResponseHandler);
	}
	$scope.submitWorkspaceForm = function($event, workspaceForm) {
		console.log("called submitWorkspaceForm");
		$scope.triedSubmit = true;
		if (!checkWorkspaceName($scope.workspace)) {
			$scope.hasWorkspaceNameErr = true;
			return;
		}
		if (workspaceForm.$valid) {
			var data = {};
			data["userId"] = $scope.userId;
			data["plan"] = $scope.plan.key_name;
			console.log("plan option is ", data.plan);
			data.workspace = $scope.workspace;
				$shared.changingPage = true;
			Backend.post("/setupWorkspace", data).then(function( res ) {
				$shared.changingPage = false;
				if (res.data.success) {

					// check if questionnaire is enabled and if we have questions
					if ($shared.customizations.registration_questionnaire_enabled && $scope.registrationQuestions.length > 0) {
						$scope.step = 4;
						$scope.invalidWorkspaceTaken = false;
						return;
					}

					$scope.step = 5;
					return;
				}

				$scope.invalidWorkspaceTaken = true;
				$scope.workspace = res.data.workspace;
			});
		}
		return false;
	}
	function getBestServicePlanOption() {
		var explicitPlan  = $stateParams['plan'];
		console.log("explicitPlan ", explicitPlan);

		if ( explicitPlan != null ) {
			return $scope.plans.find(function(plan) {
				return plan.key_name === explicitPlan;
			});
		}
		// get the default one from the API

		var featuredPlan = $scope.plans.filter((plan) => {
			if ( plan.featured_plan ) {
				return true;
			}
			return false;
		});
		console.log("featured plan ", featuredPlan);
		if ( featuredPlan.length > 0 ) {
			return featuredPlan[0];
		}

		// if no featured plan was found then use the first match.
		if ( $scope.plans.length > 0 ) {
			return $scope.plans[0];
		}

		// no plans are setup
		throw new Error("No service plan matches found");
	}
  function renderPaypalButton() {
    if ($scope.paypalLoaded) return;
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: $scope.planPrice
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
    }).render('#paypal-button-container');
    $scope.paypalLoaded = true;
  }

	$scope.finishSignup = function() {
		$scope.triedSubmit = true;
		if (!$scope.selectedTemplate) {
			      alert = $mdDialog.alert({
        title: 'Error',
        textContent: 'Please select a template',
        ok: 'Close'
      });
			return;

		}
			var data = {};
			data["userId"] = $scope.userId;
			data.templateId =  $scope.selectedTemplate.id;
				$shared.changingPage = true;
			Backend.post("/provisionCallSystem", data).then(function( res ) {
				$shared.changingPage = false;
        if ($shared.customizations.signup_requires_payment_detail) {
			$scope.gotoPaymentForm();
        } else {
          doSpinup();
        }
			});
		return false;
	}

	$scope.recall = function() {
		var data = angular.copy( $scope.verify1 );
		data.userId = $scope.userId;
				$shared.changingPage = true;
		Backend.post("/registerSendVerify", data).then(function( res ) {
				$shared.changingPage = false;
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
	    $scope.useTemplate = function (template) {
      $scope.selectedTemplate = template;
    };
    $scope.isSelected = function (template) {
      if ($scope.selectedTemplate && template.id === $scope.selectedTemplate.id) {
        return true;
      }
      return false;
    }
	$scope.gotoLogin= function() {
		$shared.changingPage = true;
		$shared.scrollToTop();
    	$state.go('login');
	}
		function stripeResponseHandler(status, response) {
			$timeout(function() {
				$scope.$apply();
				if (response.error) { // Problem!
					// Show the errors on the form
					$scope.billErrorMsg = response.error.message;
					//angular.element('.add-card-form').scrollTop(0);
				} else { // Token was created!
					// Get the token ID:
					$mdDialog.hide();
					stripeRespAddCard(response).then(function() {
						$scope.step = 5;
					});
				}
			}, 0);
		}
		function stripeRespAddCard(response) {
			return $q(function(resolve, reject) {
				var data = {};
				data['card_token'] = response.id;
				data['stripe_card'] = response.card.id;
				data['last_4'] = response.card.last4;
				data['issuer'] = response.card.brand;
				$shared.isCreateLoading =true;
				var qs = "?user_id=" + $scope.userId + "&workspace_id=" + $scope.workspaceInfo.id;
				Backend.post("/addCard" + qs, data).then(function(res) {
					resolve(res);
					$shared.endIsCreateLoading();
				}, function(err) {
					console.error("an error occured ", err);
				});
			});
		}

  function load() {
    $q.all([
      Backend.get("/getCallSystemTemplates"),
      Backend.get("/getConfig"),
      Backend.get("/getServicePlans"),
	  Backend.get("/getRegistrationQuestions"),
    ]).then(async function (res) {
      $scope.templates = res[0].data;
	  $scope.plans = res[2].data;
	  $scope.registrationQuestions = res[3].data;
	  $scope.width = ((1 / $scope.registrationQuestions.length) * 100).toString() + '%';

	  var plan = getBestServicePlanOption();
	  $scope.plan = plan;
	  console.log("selected plan option is ", plan);
      $shared.changingPage = false;
      console.log("plans ", $scope.plans);
      $scope.planInfo = plan.nice_name;
      $scope.planPrice = plan.monthly_charge;
      console.log("user selected plan is ", $stateParams['plan'] );
      // if ( $stateParams['plan'] ) {
      // 	$scope.planInfo = $scope.plans[ $stateParams['plan'] ];
      // }
      console.log("plan info is ", $scope.planInfo);
      if ( $stateParams['hasData'] ) {
        console.log("$stateParams data is ", $stateParams);
        $scope.token = $stateParams['authData'];

        $scope.userId = $stateParams['userId'];
        $scope.gotoVerificationFlow();
      }
      $scope.config = res[1].data;
      console.log("config is ", $scope.config);
      await initializePaymentGateway();
    });
  }
  load();
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('ResetCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, Idle) {
	  $shared.updateTitle("Reset");
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
			Backend.post("/account/resetPassword", data, true).then(function( res ) {
				var token = res.data;
				$scope.isLoading = false;
				/*
					$mdToast.show(
					$mdToast.simple()
						.textContent('Password was reset successfully.')
						.position("top right")
						.hideDelay(3000)
					);
					*/
				
				$shared.showMsg('Password reset', 'You have successfully reset your password.').then(function()  {
					$state.go('login', {});
				});
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SettingsCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast, $window) {
	  $shared.updateTitle("Settings");
	  $scope.triedSubmit = false;
    $scope.selectedSecurityType = "SMS verification";
    $scope.selectedVerify = "verify";
    $scope.smsVerifiedSuccessfully = false;
    $scope.authVerifiedSuccessfully = false;
    $scope.isDisabled = false;
    $scope.base64_contents ='';
	  $scope.ui = {
		  show1Secret: false,
		  show2Secret: false,
	  };

    get2FAConfig();

	$scope.user = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: "",
    enable_2fa: false,
    type_of_2fa: null,
    mobile_number: ""
	};
  $scope.selectedTheme = $window.localStorage.THEME;
  $scope.type_of_2fa = [{value: 'sms', name: 'SMS Verification'}, {value: 'totp', name: 'Authenticator App'}];
	$scope.changeCountry = function(country) {
		console.log("changeCountry ", country);
	}

  function applyDefaultTheme() {
    const defaultTheme = $shared.available_themes && $shared.available_themes.length && $shared.available_themes.find((theme) => theme.is_default);
    if (!$scope.selectedTheme) {
      $scope.selectedTheme = defaultTheme.name;
      $window.localStorage.setItem('THEME', defaultTheme.name);
    }
  }
  applyDefaultTheme();

  $scope.theme = {
    default: 'styles/app-blue.css',
    dark: 'styles/app-grey.css',
    light: 'styles/app-cyan.css',
  }
  $scope.setTheme = function(theme) {
    $scope.selectedTheme = theme;
    $window.localStorage.setItem('THEME', theme);
    Backend.post("/updateSelf", { theme: $scope.selectedTheme }).then(function(res) {
      addStyle($scope.theme[theme]);
      removeStyle($scope.theme[theme]);
    });
  };

  function addStyle(path) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  }

  function removeStyle(selectedPath) {
    const allLinks = ['styles/app-grey.css', 'styles/app-blue.css', 'styles/app-green.css', 'styles/app-red.css', 'styles/app-purple.css', 'styles/app-cyan.css' ]
    const links = document.head.querySelectorAll('link[href]');
    for (var i = 0; i < links.length; i++) {
      const path = links[i].getAttribute('href');
      if (!allLinks.includes(path)) continue;
      if (path === selectedPath) continue;
      document.head.removeChild(links[i]);
    }
  }
  $scope.onEnable2FA = function() {
    if($scope.user.enable_2fa) {
      $scope.user.type_of_2fa = 'sms';
    }
  }
  $scope.on2FASubmit = function() {
    $scope.triedSubmit = true;
    if(!$scope.user.enable_2fa) {
      $scope.user.enable_2fa = false;
      save2FASettings();
    } else {
      $scope.user.enable_2fa = true;
      if($scope.user.type_of_2fa === 'sms') {
        if(!$scope.user.mobile_number) return;
        Backend.post("/updateSelf", { mobile_number: $scope.user.mobile_number }).then(function(res) {
          save2FASettings();
        });
      } else {
        $scope.user.type_of_2fa = 'totp';
        save2FASettings();
      }
    }
  }

  $scope.onNumberChange = function() {
    $scope.user.mobile_number = Number($scope.user.mobile_number.replace(/[^0-9]/g, '').slice(0, 10));
    if (!$scope.user.mobile_number) $scope.user.mobile_number = '';
  }
  $scope.tabChanged = function (tab) {
    $scope.isDisabled = false;
    $scope.selectedSecurityType = tab;
    if($scope.selectedSecurityType === "SMS verification") {
      $scope.authVerifiedSuccessfully = false;
    } else {
      $scope.smsVerifiedSuccessfully = false;
      $scope.user.otp = '';
    }
  }
  $scope.verifyChanged = function (verify) {
    $scope.triedSubmit = true;
    $scope.selectedVerify = verify;
    if($scope.selectedVerify === "verify") {
      $scope.isDisabled = true;
      request2FACode();
    } else {
      $scope.isDisabled = false;
    }
  }
  $scope.smsVerificationSuccess = function(code) {
    if(code) {
      verify2FACode(code);
      $scope.smsVerifiedSuccessfully = true;
    }
  }
  $scope.authAppSuccess = function() {
    $scope.authVerifiedSuccessfully = true;
  }
    $scope.submitSettings = function($event, settingsForm) {
		$scope.triedSubmit = true;
		if (settingsForm.$valid) {
			var data = {};
			data['first_name'] = $scope.user.first_name;
			data['last_name'] = $scope.user.last_name;
			data['company_name'] = $scope.user.company_name;
			data['email'] = $scope.user.email;
			data['tax_number'] = $scope.user.tax_number;
			$shared.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your info')
						.position("top right")
						.hideDelay(3000)
					);
					$shared.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}

  // 2FA Functions
  function verify2FACode(code) {
    const data = {};
    data['2fa_code'] = code;
    Backend.post("/verify2FACode", data).then(function( res ) {
      $scope.authAppSuccess();
    });
  }

  function request2FACode() {
    Backend.get("/request2FACode").then(function( res ) {
      $scope.smsVerificationSuccess();
    });
  }

  function save2FASettings() {
    const data = {};
    data.enable_2fa = $scope.user.enable_2fa;
    if($scope.user.enable_2fa) data.type_of_2fa = $scope.user.type_of_2fa;
    Backend.post("/save2FASettings", data).then(function( res ) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Saved successfully..')
          .position("top right")
          .hideDelay(3000)
        );
    });
  }

  // function get2FAConfig() {
  //   const data = {};
  //   data.enable_2fa = true;
  //   data.type_of_2fa = 'sms';

  //   Backend.post("/2FAConfig", data).then(function( res ) {
  //     console.log('res', res);
  //     // $scope.user.2FAConfig = res.data;
  //   });
  // }

  function get2FAConfig() {
    Backend.get("/get2FAConfig").then(function( res ) {
      console.log('res', res);
      // $scope.user.2FAConfig = res.data;
      $scope.base64_contents = res.data.qrcode_base64;
    });
  }

   $scope.submitPersonal = function($event, personalForm) {
		$scope.triedSubmit = true;
		console.log("submitPersonal ", personalForm);
		if (personalForm.$valid) {
			var data = {};
			data['address_line_1'] =$scope.user.address_line_1;
			data['address_line_2'] =$scope.user.address_line_2;
			data['postal_code'] =$scope.user.postal_code;
			data['state'] =$scope.user.state;
			data['city'] =$scope.user.city;
			data['country'] =$scope.user.country;
			$shared.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your info')
						.position("top right")
						.hideDelay(3000)
					);
					$shared.endIsCreateLoading();
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
			$shared.isCreateLoading = true;
			Backend.post("/updateSelf", data).then(function( res ) {
				var token = res.data;
					$mdToast.show(
					$mdToast.simple()
						.textContent('Updated your passwords')
						.position("top right")
						.hideDelay(3000)
					);
				$shared.endIsCreateLoading();
			});
			return;
		}
      	return false;

	}
	$scope.show1Secret = function() {
		$scope.ui.show1Secret = true;
	}
	$scope.hide1Secret = function() {
		$scope.ui.show1Secret = false;
	}
	$scope.show2Secret = function() {
		$scope.ui.show2Secret = true;
	}
	$scope.hide2Secret = function() {
		$scope.ui.show2Secret = false;
	}

	$shared.isLoading = true;
	Backend.get("/self").then(function(res) {
      $scope.user = res.data;
      console.log("user is ", $scope.user);
      $shared.endIsLoading();
    });
  });

'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('sidenavCtrl', function($scope, $location){
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('TabsDemoCtrl', function ($scope, $window) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('TimepickerDemoCtrl', function ($scope, $log) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
 angular.module('Lineblocs').controller('todoCtrl', function ($scope) {
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
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('TooltipDemoCtrl', function ($scope) {
  $scope.dynamicTooltip = 'Hello, World!';
  $scope.dynamicTooltipText = 'dynamic';
  $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
});