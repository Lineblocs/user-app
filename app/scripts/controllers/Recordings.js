'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('RecordingsCtrl', function ($scope, Backend, $location, $state, $mdDialog, $sce, SharedPref) {
	  SharedPref.updateTitle("Recordings");
  $scope.settings = {
    page: 0
  };
  $scope.recordings = [];
  $scope.load = function() {
    SharedPref.isLoading = true;
    Backend.get("/recording/listRecordings", $scope.settings).then(function(res) {
      var recordings = res.data.data;
      SharedPref.isLoading = false;
      $scope.recordings = recordings.map(function(obj) {
        obj.uri = $sce.trustAsResourceUrl(obj.uri);
        return obj;
      });
    })
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
      Backend.delete("/recording/deleteRecording/" + recording.id).then(function() {
        console.log("deleted recording..");
        $mdToast.show(
          $mdToast.simple()
            .textContent('recording deleted..')
            .position('top right')
            .hideDelay(3000)
        );
        $scope.load();
      });
    }, function() {
    });
  }

  $scope.load();
});

