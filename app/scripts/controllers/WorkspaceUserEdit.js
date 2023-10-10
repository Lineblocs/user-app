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
      email: ""
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
      Backend.get("/getPOPs")
      ]).then(function(res) {
        $scope.values.user = res[0].data;
        for ( var index in $scope.values.roles ) {
          if ( $scope.values.user[ index ] ) {
            $scope.values.roles [ index ] = true;
          }
        }
        $scope.pops = res[3].data;
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

