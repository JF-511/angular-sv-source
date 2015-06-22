'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:scroll
 * @description
 * # scroll
 */
angular.module('odilinkApp')
  .directive('scroll', function ($window) {
  	 return {
  	 	restrict: 'A',
	  	  link:function(scope, element, attrs, window) {
	        angular.element(window).bind("scroll", function() {
	            scope.scroll = jQuery(this).scrollTop();
	            //console.log(scope.scroll );
	            scope.$apply();
	        });
	      }
	};
  });
