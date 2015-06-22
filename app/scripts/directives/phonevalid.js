'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:phonevalid
 * @description
 * # phonevalid
 */
angular.module('odilinkApp')
  .directive('phonevalid', function () {
    return {
	    restrict:'AE',
	    require:'ngModel',
	    link:function($scope,elem,attrs,ngModel){
	      ngModel.$validators.phonevalid=function(modelValue,viewValue){
	        var value=modelValue || viewValue;
	        return /^\d{10}/.test(value);
		      };
		 }
	  };   
  });
