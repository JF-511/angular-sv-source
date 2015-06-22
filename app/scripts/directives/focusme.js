'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:focusMe
 * @description
 * # focusMe
 */
angular.module('odilinkApp')
  .directive('focusOn', function ($timeout, $parse) {

    return {
    	restrict: "A",
    	link : function(scope, elem, attr) {
      	
      	var focusname = attr.focusOn;
      	scope.$watch(focusname, function(nval, oval) {
      		if (nval > 0) {
      			$timeout(function() {
      				elem[0].focus();
      			}, 50);
      		}
      	});

   		}	
   };

  });
