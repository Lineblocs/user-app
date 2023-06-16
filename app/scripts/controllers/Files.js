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

