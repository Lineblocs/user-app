'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('RecordingsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $sce, $shared, $q, $mdToast, $stateParams, $http) {
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

  function parseFilenameFromDisposition(contentDisposition) {
    if (!contentDisposition) {
      return null;
    }
    var encodedMatch = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
    if (encodedMatch && encodedMatch[1]) {
      return decodeURIComponent(encodedMatch[1]);
    }
    var plainMatch = /filename="?([^";]+)"?/i.exec(contentDisposition);
    return plainMatch && plainMatch[1] ? plainMatch[1] : null;
  }

  function triggerDownloadFromResponse(res, defaultFileName) {
    var contentType = res.headers('Content-Type') || 'application/octet-stream';
    var contentDisposition = res.headers('Content-Disposition') || '';
    var fileName = parseFilenameFromDisposition(contentDisposition) || defaultFileName;
    var blob = new Blob([res.data], { type: contentType });
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  $scope.downloadRecording = function(recording) {
    if (!recording || !recording.id) {
      return;
    }
    $shared.isLoading = true;
    $http.post(
      createUrl('/recording/downloadRecordings'),
      { recording_ids: recording.id },
      { responseType: 'blob' }
    ).then(function(res) {
      triggerDownloadFromResponse(res, 'recording-' + recording.id + '.wav');
    }).catch(function() {
      $shared.showError('Unable to download recording. Please try again.');
    }).finally(function() {
      $shared.endIsLoading();
    });
  };

  $scope.downloadAllRecordings = function() {
    var checked = ($scope.recordings || []).filter(function(recording) {
      return recording && recording.checked;
    });
    var ids = checked.map(function(recording) {
      return recording && recording.id;
    }).filter(function(id) {
      return !!id;
    });

    if (!ids.length) {
      $shared.showError('Please select one or more recordings to download.');
      return;
    }

    $shared.isLoading = true;
    $http.post(
      createUrl('/recording/downloadRecordings'),
      { recording_ids: ids.join(',') },
      { responseType: 'blob' }
    ).then(function(res) {
      triggerDownloadFromResponse(res, 'recordings.zip');
    }).catch(function() {
      $shared.showError('Unable to download recordings. Please try again.');
    }).finally(function() {
      $shared.endIsLoading();
    });
  };

  $scope.openRecordingModal = function(recording) {
    if (!recording || !recording.s3_url) {
      $shared.showError('Unable to play recording.');
      return;
    }

    var controller = function($scope, $mdDialog) {
      $scope.recording = recording;
      $scope.audioUrl = $sce.trustAsResourceUrl(recording.s3_url);
      $scope.playbackSpeed = 1;
      $scope.annotations = recording.annotations || [
        { "topic": "conversation starts", "time": 110 },
        { "topic": "caller identifies issue", "time": 45 },
        { "topic": "support resolution", "time": 280 }
      ];
      
      $scope.speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
      
      $scope.changeSpeed = function(speed) {
        $scope.playbackSpeed = speed;
        if ($scope.audioElement) {
          $scope.audioElement.playbackRate = speed;
        }
      };
      
      $scope.seekToAnnotation = function(time) {
        var audioElement = document.getElementById('recording-audio');
        if (audioElement) {
          audioElement.currentTime = time;
          audioElement.play();
          audioElement.playbackRate = $scope.playbackSpeed || 1;
        }
      };
      
      $scope.onAudioReady = function(audioElement) {
        $scope.audioElement = audioElement;
        audioElement.playbackRate = $scope.playbackSpeed;
        audioElement.autoplay = true;
      };
      
      $scope.$watch('audioElement', function(newVal) {
        if (newVal) {
          newVal.playbackRate = $scope.playbackSpeed || 1;
        }
      });

      $scope.close = function() {
        $mdDialog.cancel();
      };
    };

    $mdDialog.show({
      controller: controller,
      template: '<md-dialog>' +
                  '<md-dialog-content>' +
                    '<div style="padding: 24px;">' +
                      '<p style="color: #999; font-size: 14px;">{{recording.friendly_dates.created_at}}</p>' +
                      '<audio id="recording-audio" controls style="width: 100%; margin: 16px 0;" ng-init="onAudioReady(this)">' +
                        '<source ng-src="{{audioUrl}}" type="audio/wav">' +
                        'Your browser does not support the audio element.' +
                      '</audio>' +
                      '<div style="margin-top: 16px;">' +
                        '<label style="display: block; margin-bottom: 8px; font-weight: bold;">Playback Speed:</label>' +
                        '<div>' +
                          '<md-button ng-repeat="speed in speeds" ng-click="changeSpeed(speed)" ng-class="{\'md-raised\': playbackSpeed === speed}" class="md-primary">' +
                            '{{speed}}x' +
                          '</md-button>' +
                        '</div>' +
                      '</div>' +
                      '<div style="margin-top: 20px;">' +
                        '<label style="display: block; margin-bottom: 8px; font-weight: bold;">Annotations:</label>' +
                        '<div ng-repeat="annotation in annotations" style="padding: 8px; margin: 4px 0; background-color: #f5f5f5; border-left: 4px solid #2196F3; cursor: pointer;" ng-click="seekToAnnotation(annotation.time)">' +
                          '<strong>{{annotation.topic}}</strong> <span style="color: #999; font-size: 12px;">@ {{annotation.time}}s</span>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</md-dialog-content>' +
                  '<md-dialog-actions layout="row" layout-align="end center">' +
                    '<md-button ng-click="close()" class="md-primary">Close</md-button>' +
                  '</md-dialog-actions>' +
                '</md-dialog>',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    });
  };

  $scope.load();
});

