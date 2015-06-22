'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:OtherClick
 * @description
 * # OtherClick
 */
angular.module('odilinkApp')
  .directive('otherClick', function () {
    return {      
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('click', function() {
        	console.log(attrs.otherClick);        	
        	angular.element(angular.element("." + attrs.otherClick)[0]).click();
        });
      }
    };
  });
