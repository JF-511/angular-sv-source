'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:namevalid
 * @description
 * # namevalid
 */
angular.module('odilinkApp')
  .directive('namevalid', function () {
    return {
	    restrict:'AE',
	    require:'ngModel',
	    link:function($scope,elem,attrs,ngModel){
	      ngModel.$validators.namevalid=function(modelValue,viewValue){
	        var value=modelValue || viewValue;
	        return /^[A-Za-z\s]+$/.test(value);
		      };
		 }
	  };    
  });
