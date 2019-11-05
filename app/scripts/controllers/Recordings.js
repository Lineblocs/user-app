'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('RecordingsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $sce, SharedPref, $q, $mdToast) {
	  SharedPref.updateTitle("Recordings");
  $scope.settings = {
    page: 0
  };
  $scope.pagination = pagination;
  $scope.recordings = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      SharedPref.isLoading = true;
        pagination.changeUrl( "/recording/listRecordings" );
        pagination.changePage( 1 );
        pagination.changeScope( $scope, 'recordings' );
        pagination.loadData().then(function(res) {
        var recordings = res.data.data;
        $scope.recordings = recordings.map(function(obj) {
          obj.uri = $sce.trustAsResourceUrl(obj.uri);
          return obj;
        });
        SharedPref.endIsLoading();
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
      SharedPref.isLoading = true;
      Backend.delete("/recording/deleteRecording/" + recording.id).then(function() {
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

