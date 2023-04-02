'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .controller('SettingsCtrl', function($scope, $location, $timeout, $q, Backend, $shared, $state, $mdToast) {
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
	};
  $scope.type_of_2fa = [{value: 'sms', name: 'SMS Verification'}, {value: 'totp', name: 'Authenticator App'}];
	$scope.changeCountry = function(country) {
		console.log("changeCountry ", country);
	}
  $scope.onEnable2FA = function() {
    if(!$scope.user.enable_2fa) $scope.user.type_of_2fa = null;
    save2FASettings();
  }
  $scope.onOptionClick = function(option) {
    $scope.user.type_of_2fa = option;
    save2FASettings();
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
			data['email'] = $scope.user.email;
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
    data.type_of_2fa = $scope.user.type_of_2fa?.value;
    Backend.post("/save2FASettings", data).then(function( res ) {
      console.log('res', res);
      // $scope.user.2FAConfig = res.data;
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
	Backend.get("/self").then((res) => {
    if (!isNaN(Number(res.data['enable_2fa']))) res.data['enable_2fa'] === 0 ? res.data['enable_2fa'] = false : res.data['enable_2fa'] = true;
    return res;
  }).then(function(res) {
      $scope.user = res.data;
      console.log("user is ", $scope.user);
      $shared.endIsLoading();
    });
  });
