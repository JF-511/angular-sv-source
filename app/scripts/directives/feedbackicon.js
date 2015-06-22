'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:feedbackIcon
 * @description
 * # feedbackIcon
 */
angular.module('odilinkApp')
  .directive('feedbackIcon', function () {
    return {
      templateUrl : 'tpl/directive/feedbackIcon.html',
      restrict: 'EA',
      require: ['^?ngModel', '^?ngName'],      
      scope: {
      	ngName: '@',
      	feedbackModel : '=?',
        dataModel : '=ngModel'
      },
      transclude: true,
      controller: ['$scope', function($scope) {
        
        $scope.selected = -1;
	      $scope.feed = function(index) {
	       $scope.dataModel = index;      
         $scope.selected = index;
  		  };

	     
	    }],
      link: function postLink(scope, element, attrs) {
        //element.text('this is the feedbackIcon directive');
      }
    };
  });
