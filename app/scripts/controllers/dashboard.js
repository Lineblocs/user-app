'use strict';

/**
 * @ngdoc function
 * @name Lineblocs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of Lineblocs
 */
angular.module('Lineblocs')
  .component('ngClickOutside', {
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
  }).config(function($compileProvider) {
    $compileProvider.directive('ngClickOutside', function() {
      return {
        restrict: 'A',
        priority: 1000
      };
    });
  })
  .controller('DashboardCtrl', function($scope, $state, $rootScope, $translate, $timeout, $window, $shared, Backend) {
	$scope.$shared = $shared;

  	$scope.$state = $state;

  	$rootScope.$on('$stateChangeSuccess', function(){
		$timeout(function() {
			$('body').scrollTop(0);
		}, 200);
	});

  $scope.searchText = '';
  $scope.searchSection = function() {
    Backend.get("/search?query="+ $scope.searchText).then(function(res) {
      $scope.totalResults = res.data.categories;
      getMatchingItems();
    });
  };

  function getMatchingItems() {
    if (!$scope.totalResults || !$scope.totalResults.length) return [];
    for (const value of $scope.totalResults) {
      value.key = value.key.replace(/_/g, ' ')
      value.results = value.results.slice(0, 5);
    }
    $scope.searchResults = $scope.totalResults;
  };

  $scope.onOutsideClick = function() {
    console.log('outside click');
    $scope.searchText = '';
    $scope.totalResults = [];
  };

  $scope.selectedItemChange = function(item) {
    $scope.searchText = item.title;
    $scope.totalResults = [];
    if (item && item.ui_identifier) $state.go(item.ui_identifier, {});
  }

  	if ($('body').hasClass('extended')) {
	  	$timeout(function(){
			//$('.sidebar').perfectScrollbar();
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
			//$('.sidebar').perfectScrollbar();
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
		/*
	    if ($(window).width()<1200) {
            $('.c-hamburger').removeClass('is-active');
            $('body').removeClass('extended');
        }
        if ($(window).width()>1600) {
            $('.c-hamburger').addClass('is-active');
            //$('body').addClass('extended');
		};
		*/
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
	loadAddedResources1();
});
