'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
    .controller('progressCtrl', function($scope) {
		[].slice.call( document.querySelectorAll( 'button.progress-button' ) ).forEach( function( bttn ) {
			new ProgressButton( bttn, {
				callback : function( instance ) {
					var progress = 0,
					interval = setInterval( function() {
						progress = Math.min( progress + Math.random() * 0.1, 1 );
						instance._setProgress( progress );
						if( progress === 1 ) {
							instance._stop(1);
							clearInterval( interval );
						}
					}, 80 );
				}
			});
		});
});	
