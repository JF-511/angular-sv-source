'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:showdropmenu
 * @description
 * # showdropmenu
 */
angular.module('odilinkApp')
  .directive('showdropmenu', function () {
    return {
    require: '?^showdropmenu',
    link: function(scope, element, attrs) {
    	element.bind('click', function() {
    		var editquestion = jQuery(this).closest(".editquestion");
    		jQuery(editquestion).toggleClass('showpop');    		
    		
    	});
/*
    	jQuery("body").mousedown(function(event) {

    		if (!jQuery(event.target).hasClass("suboppanel")) {
    			if (!jQuery(event.target).hasClass("keywordpad")) {
	    			var editquestion = jQuery(element).closest(".editquestion");
	    			jQuery(editquestion).removeClass('showpop');    	
    			}		
    		}
    	});*/
    	//jQuery().unbind("click").bind("click", function() {    		
    		//var editquestion = jQuery(element).closest(".editquestion");
    		//if (jQuery(editquestion).hasClass('showpop'))
    		//	jQuery(editquestion).removeClass('showpop');    		
    	//});
    }
  	};
  });
