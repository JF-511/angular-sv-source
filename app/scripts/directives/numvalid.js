'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:numValid
 * @description
 * # numValid
 */
angular.module('odilinkApp')
  .directive('numvalid', function () {
    return {
	    restrict:'AE',
	    require:'ngModel',
	    link:function($scope,elem,attrs,ngModel){
	      ngModel.$validators.numvalid=function(modelValue,viewValue){
	        var value=modelValue || viewValue;
	        var res = false;
	        if (/^\d+$/.test(value)) {
	        	if (parseInt(value) > 0) {
	        		res = true;
	        	}
	        }
	        return res;
		      };
		 }
	  };  
  });
