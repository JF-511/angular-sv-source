'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:PublishmodalCtrl
 * @description
 * # PublishmodalCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('PublishmodalCtrl', function ($scope, $modalInstance, $filter, ODlink, items) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  $scope.items = items;
  $scope.sopend = false;
  $scope.eopend = false;
  $scope.survey = ODlink.api.getQuestionlist();  



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

    if ($scope.publishForm.$valid) {
       /*   var data = angular.copy($scope.survey);

     angular.forEach($scope.items.questions, function (i, index) {
        
          var ques = {
          questionId: i.questionId,
          text: i.text,
          orderSequence: i.orderSequence,
          answerOptionDtos: i.answerOptionDtos,
          questionTypeDto: i.questionTypeDto
        };
        data.questionDtos.push(ques);
      });
      
      //data.questionDtos = $scope.items.questions;
      data.expiryPeriod = $scope.s_expire;
      data.startDate = $filter('date')($scope.s_startdate, 'yyyy-MM-dd');
      data.endDate = $filter('date')($scope.s_enddate, 'yyyy-MM-dd');
      data.surveyDescription = $scope.s_des;
      data.surveyName = $scope.s_name;

      data.surveyRewardDto.rewardCode = $scope.r_code;
      data.surveyRewardDto.rewardName = $scope.r_name;
      data.surveyRewardDto.rewardValue = $scope.r_val;
      data.surveyRewardDto.expiryPeriodInDays = $scope.r_expire;
      data.surveyRewardDto.rewardDescription = $scope.r_des;*/

      $scope.survey.startDate =  $filter('date')($scope.survey.startDate , 'yyyy-MM-dd');
      $scope.survey.endDate =  $filter('date')($scope.survey.endDate , 'yyyy-MM-dd');

      var data = angular.copy($scope.survey);
      data.surveyId = 0;
      data.surveyRewardDto.rewardId = 0;
      angular.forEach(data.questionDtos, function(item, key) {
        
        if (item.edit != undefined)
          delete item.edit;
        angular.forEach(item.answerOptionDtos, function(i) {
          if (i.focus != undefined)
            delete i.focus;
        });

      });

      console.log(JSON.stringify(data));
        ODlink.api.publishSurvey(data, function(error) {
          $scope.ok();
          alertify.alert().set({transition : 'undefined', message : 'Problem creating the survey: ' + $scope.survey.surveyName}).set('title', 'Odilink').show();           
          console.log(error);
          if (!error) {
              $scope.ok();
              alertify.alert().set({transition : 'undefined', message : 'Successfully created the survey: ' + $scope.survey.surveyName}).set('title', 'Odilink').show();                             
          }
        });
    }
  };

  });
