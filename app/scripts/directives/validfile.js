'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:validfile
 * @description
 * # validfile
 */

angular.module('odilinkApp').directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
            el.bind('change',function(){
                    scope.$apply(function(){
                        ngModel.$setViewValue(el.val());
                        ngModel.$render();
                    });
            });
        }
    };
});