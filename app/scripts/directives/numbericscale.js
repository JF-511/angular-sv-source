'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:numbericScale
 * @description
 * # numbericScale
 */
angular.module('odilinkApp')
  .directive('numbericScale', function () {
    return {
      require: ['^?ngModel', '^?ngName', '^?ngScale'],
      templateUrl : 'tpl/directive/numbericScale.html',
      restrict: 'EA',
      scope: {
      ngName: '@',
      ngScale:'@',
      dataModel : '=ngModel',
      bindModel : '=?'

      },    
      controller: ['$scope', function($scope, $http) {      
	     
       $scope.selected = '';
	      $scope.number = function(index) {
	      	//$scope.value = index;
	      	//$scope.bindModel = index;    
	      };

        $scope.changed = function(val) {
          $scope.dataModel = val;
        };

	    }],
      link: function postLink(scope, element, attrs, ctrl) {         
      }
    };
  });
