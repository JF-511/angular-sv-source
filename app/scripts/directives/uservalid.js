'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:uservalid
 * @description
 * # uservalid
 */
angular.module('odilinkApp')
  .directive('uservalid', function () {
      return {
	    restrict:'AE',
	    require:'ngModel',
	    link:function($scope,elem,attrs,ngModel){
	      ngModel.$validators.uservalid=function(modelValue,viewValue){
	        var value=modelValue || viewValue;
	       // return /^[a-zA-z][a-zA-z0-9_-]*(@|[a-zA-z0-9_-])[a-zA-z0-9_-]*/.test(value);
	       	//var res = /^[A-Za-z][a-zA-z0-9]*/.test(value);
	       	//var 
	       	var res = /([!#$%^&*\(\)\\\/?<>\,\.\~\`+=\:\;\"\'\[\]\{\}\|])/.test(value);
	       	var res1 = /^[A-Za-z][a-zA-z0-9]*/.test(value) && (!res);	       	
	       	return res1;
		     };
		 }
	  };    
  });
 


  