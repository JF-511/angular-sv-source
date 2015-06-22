'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the odilinkApp
 */

angular.module('odilinkApp')
  .controller('ReportCtrl', function ($scope,  $routeParams, ODlink) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.errorText = '';
    $scope.datePeriod = ODlink.api.getReport();
   

    $scope.position = 0;
    $scope.scrollTop = 0;
    
   // ODlink.session.position = [];
   /* $scope.json = {
  statusMessage: "Successfully retrieved the Report.",
  userContext: {
    companyId: 1,
    businessUserId: 1
  },
  surveyDetailsDto: {
    surveyId: 1,
    surveyDescription: "Demo Questionnaire",
    surveyName: "Alpha Demo Questionnaire"
  },
  reportTotalsDto: {
    totalRequestSent: 125,
    totalResponseReceived: 100,
    fullyCompltedResponse: 100
  },
  questionReportDtos: [
    {
      questionId: 12,
      text: "Are you a rewards member?",
      orderSequence: 1,
      totalResponseReceived: 100,
      answerOptionReportDtos: [
	      {
	          optionId: 37,
	          value: "Yes",
	          responseReceived: 35,
	          percentageResponseReceived: 35
	        },
        {
          optionId: 36,
          value: "No",
          responseReceived: 65,
          percentageResponseReceived: 65
        }        
      ],
      questionTypeDto: {
        questionType: "YES_NO"
      }
    },
     {
      questionId: 4,
      text: "How did you hear about us?",
      orderSequence: 2,
      totalResponseReceived: 100,
      answerOptionReportDtos: [
        {
          optionId: 9,
          value: "Word of mouth",
          responseReceived: 45,
          percentageResponseReceived: 45
        },
        {
          optionId: 10,
          value: "Internt",
          responseReceived: 35,
          percentageResponseReceived: 35
        },
        {
          optionId: 11,
          value: "Other",
          responseReceived: 20,
          percentageResponseReceived: 20
        }
      ],
      questionTypeDto: {
        questionType: "RADIO_BUTTON"
      }
    },
    {
      questionId: 7,
      text: "Did you experience any issues during your recent visit?",
      orderSequence: 3,
      totalResponseReceived: 100,
      answerOptionReportDtos: [
        {
          optionId: 14,
          value: "Yes",
          responseReceived: 55,
          percentageResponseReceived: 55,
          answerOptionKeywordReportDtos: [
            {
              keywordId: 1,
              value: "PARKING",
              highFrequencyRank: 2
            },
            {
              keywordId: 2,
              value: "WAIT",
              highFrequencyRank: 1
            },
            {
              keywordId: 3,
              value: "LOCATION",
              highFrequencyRank: 4
            },
            {
              keywordId: 3,
              value: "HOURS",
              highFrequencyRank: 5
            },
            {
              keywordId: 3,
              value: "QUALITY",
              highFrequencyRank: 3
            },


          ]
        },
        {
          optionId: 15,
          value: "No",
          responseReceived: 45,
          percentageResponseReceived: 45
        }
      ],
      questionTypeDto: {
        questionType: "YES_NO"
      }
    },
    {
      questionId: 11,
      text: "Please rate our customer service?",
      orderSequence: 4,
      totalResponseReceived: 100,
      answerOptionReportDtos: [
        {
          optionId: 26,
          value: "1",
          responseReceived: 35,
          percentageResponseReceived: 35

        },
        {
          optionId: 33,
          value: "2",
          responseReceived: 20,
          percentageResponseReceived: 25
        },
        {
          optionId: 30,
          value: "3",
          responseReceived: 20,
          percentageResponseReceived: 20

        },
        {
          optionId: 29,
          value: "4",
          responseReceived: 20,
          percentageResponseReceived: 10

        },
        {
          optionId: 25,
          value: "5",
          responseReceived: 10,
          percentageResponseReceived: 10

        }
      ],
      questionTypeDto: {
        questionType: "NUMBER_SCALE_5"
      }
    },
          {
      questionId: 10,
      text: "How was your overall experience with us?",
      orderSequence: 5,
      totalResponseReceived: 100,
      answerOptionReportDtos: [
        {
          optionId: 20,
          value: "Very Bad",
          responseReceived: 10,
          percentageResponseReceived: 10

        },
        {
          optionId: 22,
          value: "Bad",
          responseReceived: 30,
          percentageResponseReceived: 30

        },
        {
          optionId: 19,
          value: "Neutral",
          responseReceived: 20,
          percentageResponseReceived: 20

        },
        {
          optionId: 23,
          value: "Good",
          responseReceived: 25,
          percentageResponseReceived: 25

        },
        {
          optionId: 18,
          value: "Very Good",
          responseReceived: 15,
          percentageResponseReceived: 15

        }      ],
      questionTypeDto: {
        questionType: "LIKERT_SCALE_5"
      }
    }

  ]
};{
    	statusMessage: "Successfully retrieved the Report.",
		  userContext: {
		    companyId: 1,
		    businessUserId: 1
		  },
		  surveyDetailsDto: {
		    surveyId: 1,
		    surveyDescription: "Restaurant Questionnaire",
		    surveyName: "Sample Restaurant Questionnaire"
		  },
		  reportTotalsDto: {
		    totalRequestSent: 10,
		    totalResponseReceived: 5,
		    fullyCompltedResponse: 5
		  },
		  questionReportDtos: [
		    {
		      questionId: 1,
		      text: "What is your zipcode?",
		      orderSequence: 1,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 1,
		          value: "",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        }
		      ],
		      questionTypeDto: {
		        questionType: "TEXTFIELD"
		      }
		    },
		    {
		      questionId: 2,
		      text: "How many people were in your party?",
		      orderSequence: 2,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 3,
		          value: "Two people"
		        },
		        {
		          optionId: 4,
		          value: "Three people"
		        },
		        {
		         optionId: 5,
		          value: "Four or More people",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        },
		        {
		          optionId: 2,
		          value: "Just yourself"
		        }
		      ],
		      questionTypeDto: {
		        questionType: "RADIO_BUTTON"
		      }
		    },
		    {
		      questionId: 3,
		      text: "How did you dine with us?",
		      orderSequence: 3,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 8,
		          value: "Dine In"
		        },
		        {
		          optionId: 7,
		          value: "Drive Thru",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        },
		        {
		          optionId: 6,
		          value: "Carry Out"
		        }
		      ],
		      questionTypeDto: {
		        questionType: "RADIO_BUTTON"
		      }
		    },
		    {
		      questionId: 4,
		      text: "What did you order today?",
		      orderSequence: 4,
		      totalResponseReceived: 10,
		      answerOptionReportDtos: [
		        {
		          optionId: 9,
		          value: "Beverages",
		          responseReceived: 5,
		          percentageResponseReceived: 50
		        },
		        {
		          optionId: 11,
		          value: "Appetizers"
		        },
		        {
		          optionId: 10,
		          value: "Entree",
		          responseReceived: 5,
		          percentageResponseReceived: 50
		        }
		      ],
		      questionTypeDto: {
		        questionType: "CHECK_BOX"
		      }
		    },
		    {
		      questionId: 5,
		      text: "What day do you visit more often?",
		      orderSequence: 5,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 12,
		          value: "",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        }
		      ],
		      questionTypeDto: {
		        questionType: "WEEK_DAYS"
		      }
		    },
		    {
		      questionId: 6,
		      text: "What time do you visit more often?",
		      orderSequence: 6,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 13,
		          value: "",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        }
		      ],
		      questionTypeDto: {
		        questionType: "TIME"
		      }
		    },
		    {
		      questionId: 7,
		      text: "Did you experience any problems during your recent visit?",
		      orderSequence: 7,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 14,
		          value: "Yes",
		          responseReceived: 7,
		          percentageResponseReceived: 70,
		          answerOptionKeywordReportDtos: [
		            {
		              keywordId: 1,
		              value: "AMBIENCE",
		              highFrequencyRank: 3
		            },
		            {
		              keywordId: 2,
		              value: "PARKING",
		              highFrequencyRank: 2
		            },
		            {
		              keywordId: 3,
		              value: "staff",
		              highFrequencyRank: 1
		            },
		            {
		              keywordId: 3,
		              value: "cleanliness",
		              highFrequencyRank: 1
		            },
		            {
		              keywordId: 3,
		              value: "cleanliness",
		              highFrequencyRank: 1
		            },
		            {
		              keywordId: 3,
		              value: "hours",
		              highFrequencyRank: 1
		            },
		            {
		              keywordId: 3,
		              value: "location",
		              highFrequencyRank: 1
		            },
		            {
		              keywordId: 3,
		              value: "weather",
		              highFrequencyRank: 1
		            },
		            {
		              keywordId: 3,
		              value: "crowd",
		              highFrequencyRank: 1
		            }		           
		          ]
		        },
		        {
		          optionId: 15,
		          value: "No",
		          responseReceived: 3,
		          percentageResponseReceived: 30
		        }
		      ],
		      questionTypeDto: {
		        questionType: "YES_NO"
		      }
		    },
		    {
		      questionId: 8,
		      text: "Date when you would most likely visit us again?",
		      orderSequence: 8,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 16,
		          value: "",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        }
		      ],
		      questionTypeDto: {
		        questionType: "CALENDAR"
		      }
		    },
		    {
		      questionId: 9,
		      text: "Please tell us how we can improve?",
		      orderSequence: 9,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 17,
		          value: "",
		          responseReceived: 5,
		          percentageResponseReceived: 100,
		          answerOptionKeywordReportDtos: [
		            {
		              keywordId: 4,
		              value: "IMPROVE AMBIENCE",
		              highFrequencyRank: 1,
		              responseReceived: 5
		            },
		            {
		              keywordId: 5,
		              value: "IMPROVE PARKING",
		              highFrequencyRank: 3
		            },
		            {
		              keywordId: 6,
		              value: "IMPROVE HIRING",
		              highFrequencyRank: 2
		            }
		          ]
		        }
		      ],
		      questionTypeDto: {
		        questionType: "TEXTBOX"
		      }
		    },
		    {
		      questionId: 10,
		      text: "How likely are you going to recommend restaurant to a friend or colleague?",
		      orderSequence: 10,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 20,
		          value: "0"
		        },
		        {
		          optionId: 22,
		          value: "3"
		        },
		        {
		          optionId: 19,
		          value: "2"
		        },
		        {
		          optionId: 23,
		          value: "1"
		        },
		        {
		          optionId: 18,
		          value: "4"
		        },
		        {
		          optionId: 21,
		          value: "5",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        }
		      ],
		      questionTypeDto: {
		        questionType: "LIKERT_SCALE_5"
		      }
		    },
		    {
		      questionId: 11,
		      text: "How likely are you to visit us next time?",
		      orderSequence: 11,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 26,
		          value: "6"
		        },
		        {
		          optionId: 33,
		          value: "1"
		        },
		        {
		          optionId: 30,
		          value: "0"
		        },
		        {
		          optionId: 29,
		          value: "5"
		        },
		        {
		          optionId: 25,
		          value: "3"
		        },
		        {
		          optionId: 32,
		          value: "4"
		        },
		        {
		          optionId: 34,
		          value: "9",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        },
		        {
		          optionId: 28,
		          value: "7"
		        },
		        {
		          optionId: 31,
		          value: "8"
		        },
		        {
		          optionId: 27,
		          value: "10"
		        },
		        {
		          optionId: 24,
		          value: "2"
		        }
		      ],
		      questionTypeDto: {
		        questionType: "NUMBER_SCALE_10"
		      }
		    },
		    {
		      questionId: 12,
		      text: "Did the staff member you interacted with say please and thank you?",
		      orderSequence: 12,
		      totalResponseReceived: 5,
		      answerOptionReportDtos: [
		        {
		          optionId: 36,
		          value: "No",
		          responseReceived: 5,
		          percentageResponseReceived: 100
		        },
		        {
		          optionId: 35,
		          value: "Yes"
		        }
		      ],
		      questionTypeDto: {
		        questionType: "YES_NO"
		      }
		    }
		  ]
		}; 
		$scope.json.questionReportDtos[0].edit = true; 
		          angular.forEach($scope.json.questionReportDtos, function(item, key) {
		          	item.answerOptionReportDtos.position = [];
		          	item.answerOptionReportDtos.scale = [];
		          });
		*/
		

		
		$scope.getTemplateName = function(question, part) {
		      var template = question.questionTypeDto.questionType;
		      if (template == "YES_NO") {
		        template = "RADIO_BUTTON";
		      }

		      if (template == "STAR_RATING_10") {
		        template = "STAR_RATING_5";
		      }

		      switch (template) {
		        case "NUMBER_SCALE_10":                  
		        case "NUMBER_SCALE_5":                  
		        case "NUMBER_SCALE_10":
		          template = "NUMBER_SCALE_5";
		        break;
		        case  "PROGRESS_BAR_100":
		          template = "PROGRESS_BAR_10";
		        break;
		      }
		      return template + part + ".html";
		};



		$scope.editMode = function (current) {
	        $scope.position = current;
	            for(var i=$scope.json.questionReportDtos.length;i--;)
	            {
	                $scope.json.questionReportDtos[i].edit = false;
	            }

	            $scope.json.questionReportDtos[current].edit = true;    	                  
	        //console.log($scope.scrollTop); 
	        $scope.scrollTop = angular.element(".edit").attr('style');	       
	    };

	    $scope.$watchCollection(function() {
	    	return ODlink.api.getReport();
	    }, function(nval, oval) {
        	var sid = $routeParams.sid != undefined ? parseInt($routeParams.sid, 10) : 0;
  			$scope.errorText = '';
	    	ODlink.api.reportlist(sid, function(error, data) {

	        if (error) {
	         
	          $scope.errorText = 'No report Matching this criteria';
	        }
	        else {
	          if (typeof data.questionReportDtos === 'undefined') {
	          	$scope.errorText = data.statusMessage;
	          }	      
	          else {
	          	//ODlink.api.setQuestionlist(data.questionnaireDetailDto);
		          $scope.json = data;  
		          $scope.json.questionReportDtos[0].edit = true; 
		          angular.forEach($scope.json.questionReportDtos, function(item, key) {
		          	item.answerOptionReportDtos.position = [];
		          	item.answerOptionReportDtos.scale = [];
		          });
		          //$scope.$digest();	
	          }         
	        }
	      });

	    }, false);
  });
