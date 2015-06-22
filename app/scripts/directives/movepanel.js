'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:MovePanel
 * @description
 * # MovePanel
 */
angular.module('odilinkApp')
  .directive('movepanel', function ($window) {
    return {          
      link: function postLink(scope, element, attrs) {
           angular.element($window).bind("scroll", function() {
        	var pos = jQuery(window).scrollTop();
          var max = jQuery(".view").height();
          if (pos >= max + 80) {
            pos = max + 80;
          }
        	else if (pos > 80 ) {
        		pos = pos - 80;
        	}
        	else {
        		pos = 0;
        	}
        	scope.scrollTop = pos;  
        	scope.$apply();      	
        	jQuery(element).attr("style", "margin-top:" + pos + "px");
        });
      }
    };
  });
