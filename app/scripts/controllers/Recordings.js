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

