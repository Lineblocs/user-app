'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('LoginCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, Idle, $interval) {
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
