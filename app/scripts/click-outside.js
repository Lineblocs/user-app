/*! ngclipboard - v2.0.0 - 2018-03-03
* https://github.com/sachinchoolur/ngclipboard
* Copyright (c) 2018 Sachin; Licensed MIT */
(function () {
  'use strict';
  var MODULE_NAME = 'ngClickOutside';
  var angular;

  // Check for CommonJS support
  if (typeof module === 'object' && module.exports) {
    angular = require('angular');
    module.exports = MODULE_NAME;
  } else {
    angular = window.angular;
  }

  angular.module('myApp').component('ngClickOutside', {
    restrict: 'A',
    compile: function($element, attrs) {
      return {
        post: function(scope, element, attrs) {
          var onClick = function(event) {
            if (!element[0].contains(event.target)) {
              scope.$eval(attrs.ngClickOutside);
              scope.$apply();
            }
          };
          document.addEventListener('click', onClick);
          scope.$on('$destroy', function() {
            document.removeEventListener('click', onClick);
          });
        }
      };
    }
  });

  angular.module('myApp').config(function($compileProvider) {
    $compileProvider.directive('ngClickOutside', function() {
      return {
        restrict: 'A',
        priority: 1000
      };
    });
  });
})();
