'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:notequals
 * @description
 * # notequals
 */
angular.module('odilinkApp')
  .directive('notequals', function () {
    return {
     require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            
            scope.$watch(attrs.notequals, function (value) {
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('notequals', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('notequals', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.notequals);
                model.$setValidity('notequals', isValid);
                return isValid ? value : undefined;
            });
        }
    };
  });
