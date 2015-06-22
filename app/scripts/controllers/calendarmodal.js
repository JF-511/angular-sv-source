'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:CalendarmodalCtrl
 * @description
 * # CalendarmodalCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('CalendarmodalCtrl', function ($scope, ODlink, $filter, $modalInstance) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var survey = ODlink.api.getQuestionlist();
    /*if (ODlink.api.getReport()) {
      $scope.report = ODlink.api.getReport();
    }
    else {
      $scope.report = {
      startDate : survey.startDate,
      endDate : $filter('date')(new Date() , 'yyyy-MM-dd')
      };  
    }*/
    $scope.report = {
      startDate : '',
      endDate : ''
      };  
    $scope.open = function($event, opt) {

	    event.preventDefault();
	    $event.stopPropagation();

	    if (opt == "1") {
	      $scope.sopend = true;
	    }
	    else {
	      $scope.eopend = true;
	    }
  }

	$scope.ok = function () {
	   $modalInstance.close();
	};

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};

	 $scope.confirm = function() {

    	if ($scope.calendarForm.$valid) {
    		ODlink.api.setReport({
      startDate : $filter('date')($scope.report.startDate , 'yyyy-MM-dd'),
      endDate : $filter('date')($scope.report.endDate , 'yyyy-MM-dd')
    });
    		//ODlink.api.setSurveyid(sid);
    		var url = '/dashboard/report/' + ODlink.api.getSurveyid();

    		/*url +=  $filter('date')($scope.report.startDate , 'yyyy-MM-dd') + '/';
    		url +=  $filter('date')($scope.report.endDate , 'yyyy-MM-dd');*/

    		$scope.ok();
    		ODlink.session.path(url);
    	}
    };

  });
