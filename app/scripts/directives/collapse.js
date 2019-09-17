var pc = angular.module('paperCollapse', []);

pc.directive('paperCollapse', function () {
    return {
        restrict: 'AE',
        templateUrl: 'scripts/directives/paper-collapse.ng.html',
        scope: {
            cards: '=paperCollapseCards'
        },
        controller: function($scope, $mdDialog){
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
        }
    };
});