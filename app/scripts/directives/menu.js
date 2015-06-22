'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:menu
 * @description
 * # menu
 */
angular.module('odilinkApp')
  .directive('menu', function () {
    return {      
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('click', 'li', function () {
        	element.find('li').each(function() {
        		jQuery(this).removeClass('active');
        	});
        	jQuery(this).addClass('active');
        });

        jQuery(".navbar-header > .navbar-toggle").unbind('click').bind('click', function() {
          if (jQuery("#bs-example-navbar-collapse-1").length > 0) {
            jQuery("#bs-example-navbar-collapse-1").toggleClass("in");
          }
          if (jQuery("#dashheader > ul.navbar-nav").length > 0) {
            jQuery(jQuery("#dashheader > ul.navbar-nav")[1]).toggleClass("in");
          }
        });
      }
    };
  });
