'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
  .controller('DashboardCtrl', function($scope, $state, $rootScope, $translate, $timeout, $window) {

  	if ($(window).width()<1450) {
        $( '.c-hamburger' ).removeClass('is-active');
        $('body').removeClass('extended');
    }

  	$scope.$state = $state;

  	$rootScope.$on('$stateChangeSuccess', function(){ 
		$timeout(function() {
			$('body').scrollTop(0);
		}, 200);
	});

  	if ($('body').hasClass('extended')) {
	  	$timeout(function(){
			$('.sidebar').perfectScrollbar();
		}, 200);		
  	};

  	$scope.rtl = function(){
  		$('body').toggleClass('rtl');
  	}
  	$scope.subnav = function(x){
		if(x==$scope.showingSubNav)
			$scope.showingSubNav = 0;			
		else
			$scope.showingSubNav = x;
		return false;
	}
	$scope.extend = function  () {
		$( '.c-hamburger' ).toggleClass('is-active');
        $('body').toggleClass('extended');
        $('.sidebar').toggleClass('ps-container');	
        $rootScope.$broadcast('resize');
        $timeout(function(){
			$('.sidebar').perfectScrollbar();
			console.log('pfscroll');
		}, 200);	
	}	
	
	

	$scope.changeTheme = function(setTheme){

		$('<link>')
		  .appendTo('head')
		  .attr({type : 'text/css', rel : 'stylesheet'})
		  .attr('href', 'styles/app-'+setTheme+'.css');
	}
	
	var w = angular.element($window);
  
	w.bind('resize', function () {
	    if ($(window).width()<1200) {
            $('.c-hamburger').removeClass('is-active');
            $('body').removeClass('extended');
        } 
        if ($(window).width()>1600) {
            $('.c-hamburger').addClass('is-active');
            $('body').addClass('extended');          
        };
	});   

	if ($(window).width()<1200) {		
		$rootScope.$on('$stateChangeSuccess', function(){ 
			$( '.c-hamburger' ).removeClass('is-active');
        	$('body').removeClass('extended');
		});
	}

	if ($(window).width()<600) {		
		$rootScope.$on('$stateChangeSuccess', function(){ 
			$( '.mdl-grid' ).removeAttr('dragula');
		});
	}
	
	$scope.changeLanguage = (function (l) {
		
		$translate.use(l);			
		
	});
	
});	
