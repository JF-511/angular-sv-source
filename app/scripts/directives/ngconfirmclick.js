'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:ngConfirmClick
 * @description
 * # ngConfirmClick
 */
angular.module('odilinkApp')
  .directive('ngConfirmClick', function () {
    return {    
       restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {

                var message = attrs.ngReallyMessage;               
              
             alertify.confirm().set({transition : 'undefined'}).set('title', 'Odilink') .setting({
                message : message,                
                onok : function() {
                  scope.$apply(attrs.ngConfirmClick);
                }
             }).show();
            
        });
    }
  };
  });
