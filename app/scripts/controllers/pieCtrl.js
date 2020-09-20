'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs').controller('piechartCtrl', ['$scope', function ($scope) {
   
    $scope.options1 = {
        animate:{
            duration:2000,
            enabled:true
        },
        barColor:'#F0AD4E',
        trackColor:'#ECF0F1',
        scaleColor:'#737373',

        lineWidth:5,
        size: 115,
        lineCap:'circle'
    };
    $scope.options2 = {
        animate:{
            duration:2000,
            enabled:true
        },
        barColor:'#3CA2E0',
        trackColor:'#ECF0F1',
        scaleColor:'#737373',

        lineWidth:5,
        size: 115,
        lineCap:'circle'
    };
    $scope.options3 = {
        animate:{
            duration:2000,
            enabled:true
        },
        barColor:'#D9534F',
        trackColor:'#ECF0F1',
        scaleColor:'#737373',

        lineWidth:5,
        size: 115,
        lineCap:'circle'
    };
}]);