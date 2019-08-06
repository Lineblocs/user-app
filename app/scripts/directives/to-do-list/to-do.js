'use strict';

angular.module('MaterialApp')
.directive('todolist',function(){
		return {
	    templateUrl:'scripts/directives/to-do-list/to-do.html?v='+window.app_version,
	    restrict: 'E',
	    replace: true,
    	controller: function($scope){

			setTimeout(function(){
    			$('.todo-list-wrap').perfectScrollbar();
			}, 100);

        }
	}
});
