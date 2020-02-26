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
	  SharedPref.processResult();
	$scope.triedSubmit = false;
	$scope.couldNotLogin = false;
	$scope.noUserFound = false;
	$scope.shouldSplash = false;
	$scope.isLoading = false;
	$scope.challenge = null;
	$scope.user = {
		email: "",
		password: ""
	};
	$scope.step = 1;
var clickedGoogSignIn = false;

	function finishLogin(token, workspace) {
		console.log("finishLogin ", arguments);
				$scope.isLoading = false;
				$scope.couldNotLogin = false;
				SharedPref.setAuthToken(token);
				SharedPref.setWorkspace(workspace);
				Idle.watch();
		        $state.go('dashboard-user-welcome', {});
	}
    $scope.submit1 = function($event, loginForm) {
		$scope.step = 2;
	}
    $scope.submit1 = function($event, loginForm) {
		$scope.triedSubmit = true;
		if (loginForm.$valid) {
			SharedPref.changingPage = true;
			Backend.get("/getUserInfo?email=" + $scope.user.email).then(function( res ) {
				SharedPref.changingPage = false;
				if ( res.data.found ) {
					$scope.userInfo = res.data.info;
					$scope.step = 2;
					return;
				}
				$scope.noUserFound = true;
			});
		}
	}

    $scope.submit = function($event, loginForm) {
		$scope.triedSubmit = true;
		if (loginForm.$valid) {
			var data = angular.copy( $scope.user );
			data['challenge'] = $scope.challenge;
			$scope.isLoading = true;
			Backend.post("/jwt/authenticate", data).then(function( res ) {
				var token = res.data;
				finishLogin(token, res.data.workspace);
			}).catch(function() {
				$scope.isLoading = false;
				$scope.couldNotLogin = true;
			})
			return;
		}
    }
	$scope.gotoRegister = function() {
		SharedPref.changingPage = true;
		SharedPref.scrollToTop();
    	$state.go('register');
	}
	$scope.gotoForgot = function() {
		SharedPref.changingPage = true;
		SharedPref.scrollToTop();
		$state.go('forgot');
	}

	$scope.startThirdPartyLogin = function(email, firstname, lastname, avatar) {
		var data = {};
		data['email'] = email;
		data['first_name'] = firstname;
		data['last_name'] = lastname;
		data['avatar'] = avatar;
		data['challenge'] = $scope.challenge;
			SharedPref.changingPage = true;
		Backend.post("/thirdPartyLogin", data).then(function( res ) {
			$timeout(function() {
				$scope.$apply();
				SharedPref.scrollToTop();

				if ( res.data.confirmed ) {
					finishLogin(res.data.info, res.data.info.workspace);
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
		'onsuccess': function(googleUser) {
				if (!clickedGoogSignIn) {
					return;
				}
				var profile = googleUser.getBasicProfile();
				console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
				console.log('Name: ' + profile.getName());
				console.log('Image URL: ' + profile.getImageUrl());
				console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
				var ctrl= angular.element("body").scope();
				var fullName = profile.getName().split(' '),
    				firstName = fullName[0],
    				lastName = fullName[fullName.length - 1];
				$scope.startThirdPartyLogin( profile.getEmail(), firstName, lastName, profile.getImageUrl() );
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
	SharedPref.changingPage = false;
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

	renderButton();
  });
