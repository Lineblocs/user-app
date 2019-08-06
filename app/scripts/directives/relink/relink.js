angular.module('MaterialApp').directive('relinkEvent', function($rootScope, $timeout) {
    return {
        transclude: 'element',
        restrict: 'A',
        link: function(scope, element, attr, ctrl, transclude) {           
            var previousContent = null;
            var triggerRelink = function() {
                if (previousContent) {
                    previousContent.remove();
                    previousContent = null;
                }
                $timeout(function () {
                    transclude(function (clone) {
                        element.parent().append(clone);
                        previousContent = clone;
                    });
                }, 250);
            };
            triggerRelink();                
            $rootScope.$on(attr.relinkEvent, triggerRelink);
        }
    };
});