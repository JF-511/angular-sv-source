'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:ReplyCtrl
 * @description
 * # ReplyCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('ReplyCtrl', function (ODlink, $scope, $sce, $modal, $filter, $window, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.ismeridian = true;
    $scope.today = new Date();
    $scope.reply = JSON.parse('{    \
		  "surveyId": 0,   \
		  "customerId": 0,   \
		  "customerSurveyQuestionAnswersDtos": [ \
		  ]   \
		}');
   	$scope.answers = JSON.parse(' \
		    {   \
		      "questionId": 0, \
		      "customerSurveyAnswerDtos": [ \
		        {   \
		          "selectedAnswerId": 0,  \
		          "selectedKeywords": [   \
		            {   \
		              "keyword": "",   \
		              "keywordId": 0   \
		            }   \
		          ],   \
		          "responseValue": ""  \
		        }   \
		      ]   \
		    }   ');

    $scope.sort = function(question) {
      if (typeof question === 'undefined') {

          angular.forEach($scope.jsonObj.questionDtos, function(item, key) {
               switch (item.questionTypeDto.questionType) {
                case "RADIO_BUTTON":
                case "CHECK_BOX":
                case "NUMBER_SCALE_0_5":
                case "NUMBER_SCALE_1_5":
                case "NUMBER_SCALE_0_10":
                case "NUMBER_SCALE_1_10":
                case "PROGRESS_BAR_100":
                case "PROGRESS_BAR_10":
                 item.answerOptionDtos = $filter('orderBy')(item.answerOptionDtos, 'value');
                break;
                case "YES_NO":
                  if (item.answerOptionDtos[0].value.toLowerCase() != "yes") {
                      var t = item.answerOptionDtos[0];
                      item.answerOptionDtos[0] = item.answerOptionDtos[1];
                      item.answerOptionDtos[1] = t;
                  }
                break;
               case "LIKERT_SCALE_AGREE":
               case "LIKERT_SCALE_LIKELY":
               case "LIKERT_SCALE_SATISFIED":
               case "LIKERT_SCALE_OTHER":
               case "LIKERT_SCALE_GOOD":
                  //item.answerOptionDtos = $filter('orderBy')(item.answerOptionDtos, 'optionId');
                  var first = true;
                  var last = item.answerOptionDtos.length - 1;
                  angular.forEach(item.answerOptionDtos, function(i, key){
                    if (i.value.trim().indexOf(" ") > 0) {
                      if (!first) {
                        item.answerOptionDtos.swap(key, last);
                        return false;
                      } 
                      else {
                        item.answerOptionDtos.swap(0, key);
                      }                     
                      first = false;                      
                    }
                  });

                  var firstele = item.answerOptionDtos[0].value.trim().length;
                  var lastele = item.answerOptionDtos[last].value.trim().length;

                  if (firstele <= lastele) {
                    if (item.answerOptionDtos[0].value.trim().indexOf("very") < 0) {
                      item.answerOptionDtos.swap(0, last);
                    }                    
                  }
               break;
              };
          });  
      }
      else {
        question.answerOptionDtos = $filter('orderBy')(item.answerOptionDtos, 'value');
      }
      
    }

    $scope.jsonObj  = {};
    var self = this;
    var sid = $routeParams.sid != undefined ? parseInt($routeParams.sid, 10) : 1;
    $scope.sid = sid;
    if (sid > 0) {
     
     
        ODlink.api.questionlist(sid, function(error, data) {

          if (error) {
            /* */

          }
          else {

           // ODlink.api.setQuestionlist(null);
            //ODlink.api.setQuestionlist($scope.jsonObj);
            $scope.jsonObj = data.questionnaireDetailDto;  
            $scope.jsonObj.questionDtos = $filter('orderBy')($scope.jsonObj.questionDtos, 'orderSequence');
           // $scope.sort();
           
            
            angular.forEach(data.questionnaireDetailDto, function(item) {
            	$scope.reply.customerSurveyQuestionAnswersDtos.push(angular.copy($scope.answers));
            });
          }
        });
     
    }    

    $scope.getTemplateName = function(question, part) {
      var template = question.questionTypeDto.questionType;
      if (template == "YES_NO") {
        template = "RADIO_BUTTON";
      }
      switch (template) {
        case "LIKERT_SCALE_AGREE":
        case "LIKERT_SCALE_LIKELY":
        case "LIKERT_SCALE_SATISFIED":
        case "LIKERT_SCALE_OTHER":
          template = "LIKERT_SCALE_GOOD";
        break;
        case "NUMBER_SCALE_0_10":                  
        case "NUMBER_SCALE_1_5":                  
        case "NUMBER_SCALE_1_10":
          template = "NUMBER_SCALE_0_5";
        break;
        case  "PROGRESS_BAR_100":
          template = "PROGRESS_BAR_10";
        break;
        case "MONTH":
        case "COMBO":
          template = "WEEK_DAYS";
        break;
      }
      return template + part + ".html";
    };

		/* datetime */
    	$scope.open = function($event, body) {
	      $event.preventDefault();
	      $event.stopPropagation();

	      body.opend = true;
	    };

	 $scope.choiceSelect = function($item, $question) {

      $scope.mulitple = $item;
    };

    $scope.save = function() {
    	$scope.reply.customerSurveyQuestionAnswersDtos = [];
      var missed = [];
    	angular.forEach($scope.jsonObj.questionDtos, function(q, key) {    

    		switch (q.questionTypeDto.questionType) {
    			
    			
    			case "TEXTBOX":
    			case "TEXTFIELD":
    				if (q.selected != undefined && q.selected.trim() != "") {

    					var t = angular.copy($scope.answers);
    					t.customerSurveyAnswerDtos[0].selectedAnswerId = q.answerOptionDtos[0].optionId;
    					t.customerSurveyAnswerDtos[0].responseValue = q.selected;
    					t.questionId = q.questionId;
    					$scope.reply.customerSurveyQuestionAnswersDtos.push(t);
    				}
            else {
              missed.push(q.orderSequence);
            }
    			break;
    			case "CALENDAR":
    				
    				if (q.selected != undefined && q.selected.toString().trim() != "") {

    					var t = angular.copy($scope.answers);
    					t.customerSurveyAnswerDtos[0].selectedAnswerId = q.answerOptionDtos[0].optionId;
    					t.customerSurveyAnswerDtos[0].responseValue = $filter('date')(q.selected, 'yyyy-MM-dd');
    					t.questionId = q.questionId;
    					$scope.reply.customerSurveyQuestionAnswersDtos.push(t);
    				}
    				else {
              missed.push(q.orderSequence);
            }
    			break;
    			case "WEEK_DAYS":
		        case "COMBO":
		        case "MONTH":
					
    				if (q.selected != undefined  ) {
    					var t = angular.copy($scope.answers);
    					t.customerSurveyAnswerDtos[0].selectedAnswerId = q.selected.optionId;
    					t.customerSurveyAnswerDtos[0].responseValue = q.selected.value;
    					t.questionId = q.questionId;
    					$scope.reply.customerSurveyQuestionAnswersDtos.push(t);
    				}
    				else {
              missed.push(q.orderSequence);
            }
		        break;
		        case "PROGRESS_BAR_10":
		        case "PROGRESS_BAR_100":
					
    				if (q.selected != undefined && q.selected != "") {
    					var t = angular.copy($scope.answers);
    					angular.forEach(q.answerOptionDtos, function(item, key) {
    						if (q.selected == item.value) {
    							t.customerSurveyAnswerDtos[0].selectedAnswerId = item.optionId;
    							t.customerSurveyAnswerDtos[0].responseValue = item.value;
    							return false;
    						}
    					});
    					t.questionId = q.questionId;
    					$scope.reply.customerSurveyQuestionAnswersDtos.push(t);
    				}
    				else {
              missed.push(q.orderSequence);
            }
		        break;

		        case "STAR_RATING_BAR":
		        	
    				if (q.selected != undefined ) {
    					var t = angular.copy($scope.answers);
    					t.customerSurveyAnswerDtos[0].selectedAnswerId = q.answerOptionDtos[q.selected - 1].optionId;
    					t.customerSurveyAnswerDtos[0].responseValue = q.answerOptionDtos[q.selected - 1].value;
    					t.questionId = q.questionId;
    					$scope.reply.customerSurveyQuestionAnswersDtos.push(t);		
    				}
    				else {
               missed.push(q.orderSequence);
            }       
    			break;

    			case "CHECK_BOX":
    				var t = angular.copy($scope.answers);
    				t.questionId = q.questionId;
    				var chk = angular.copy(t.customerSurveyAnswerDtos[0]);
    				t.customerSurveyAnswerDtos = [];
    				var ischecked = false;
    				angular.forEach(q.answerOptionDtos, function(i, k) {
    					if (i.selected != undefined && i.selected) {
    						var ct = angular.copy(chk);
    						ct.selectedAnswerId = i.optionId;
    						ct.responseValue = i.value;
    						t.customerSurveyAnswerDtos.push(ct);
    						ischecked = true;
    					}
    				});

    				if (ischecked) {
    					$scope.reply.customerSurveyQuestionAnswersDtos.push(t);
    				}
            else {
              missed.push(q.orderSequence);
            }   
            break;    
            default:
            if (q.selected != undefined && q.selected.trim() != "") {
              var t = angular.copy($scope.answers);
              t.customerSurveyAnswerDtos[0].selectedAnswerId = q.answerOptionDtos[q.selected].optionId;
              t.customerSurveyAnswerDtos[0].responseValue = q.answerOptionDtos[q.selected].value;
              t.questionId = q.questionId;
              $scope.reply.customerSurveyQuestionAnswersDtos.push(t);
            }
            else {
              missed.push(q.orderSequence);
            }     
    			break;
    		}
		    
    	});
    	
    	if (missed.length == 0) {
    		$scope.reply.surveyId = $scope.sid;
    		//$scope.reply.customerId = 
    		console.log(JSON.stringify($scope.reply));
    		ODlink.api.completeSurvey($scope.reply, function(error) {
    			if (error) {
    				alertify.alert().set({transition : 'undefined', message : 'Problem submitting the survey: ' + $scope.jsonObj.surveyName}).set('title', 'Odilink').show();           
    			}else {
    				alertify.alert().set({transition : 'undefined', message : 'Successfully submit the survey: ' + $scope.jsonObj.surveyName}).set('title', 'Odilink').show();                             
          
    			}
    		});
    		
    	}
      else {        
        var unanswer = missed.join();
        alertify.alert().set({transition : 'undefined', message : 'Please answer the following questions:' + unanswer}).set('title', 'Odilink').show();           
      }
    };

    $scope.change_rate = function(question) {
    	console.log(question.selected);
    }

  });
