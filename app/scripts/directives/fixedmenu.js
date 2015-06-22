'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:fixedmenu
 * @description
 * # fixedmenu
 */
angular.module('odilinkApp')
  .directive('fixedmenu', function ($window) {
    return {     
      restrict: 'EA',
      scope: {
      	bindModel:'=ngModel'
      },
      link: function postLink(scope, element, attrs) {
        	angular.element($window).bind("scroll", function() {
	        	var pos = jQuery(window).scrollTop();
            var scrollpos = pos;
	        	if (pos > 150) {
	        		pos = pos - 150;
	        		jQuery(".fixed-header").removeClass("hide");
	        		var w = jQuery(".view").width();
	        		scope.bindModel.width = jQuery("body > div.container").width() + 30;
	        		scope.bindModel.height = jQuery(window).height() - 20;	        		
	        		
	        		scope.$apply();
	        		jQuery(".fixed-header").attr("style", "width:" + w + "px");
	        	}
	        	else {
	        		pos = 0;
	        		jQuery(".fixed-header").addClass("hide");
	        	}
	        	
            var questions = jQuery(".view .ui-sortable > div.question");
            var count = questions.length;
            questions.each(function(index, item) {
                var itempos = jQuery(item).offset();

                if (0 > (scrollpos + 200 - itempos.top)) {
                  console.log(scrollpos + " : " + itempos.top);
                  var i = index > 0 ? index - 1 : 0;

                  if (!jQuery(questions[i]).hasClass("current-edit"))
                    jQuery(questions[i]).find("> div.sections").click();
                  return false;
                }
            });
            //console.log(jQuery(jQuery(".view .ui-sortable > div.question")[4]).offset());
	        	//console.log(scope.bindModel.height);
        	});

        	angular.element($window).bind("resize", function() {
        		//console.log(jQuery(".view").width());
        		var w = jQuery(".view").width();
        		scope.bindModel.width = jQuery("body > div.container").width() + 30;
        		scope.bindModel.height = jQuery(window).height() - 20;
        		scope.$apply();
        		//console.log(scope.bindModel);

        		jQuery(".fixed-header").attr("style", "width:" + w + "px");
        	});
      }
    };
  });
