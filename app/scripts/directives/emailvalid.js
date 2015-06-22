'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:emailvalid
 * @description
 * # emailvalid
 */
angular.module('odilinkApp')
  .directive('emailvalid', function () {
   return {
	    restrict:'AE',
	    require:'ngModel',
	    link:function($scope,elem,attrs,ngModel){
	      ngModel.$validators.emailvalid=function(modelValue,viewValue){
	        var value=modelValue || viewValue;
	        return /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/.test(value);
		      };
		 }
	  };   
  });
