'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the odilinkApp
 */

var g_queue_count = 10;
var  padding = 55;
angular.module('odilinkApp')
  .controller('MainCtrl', function (ODlink, $scope, $sce, $modal, $filter, $window, $routeParams) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    Array.prototype.swap = function (x,y) {
      var b = this[x];
      this[x] = this[y];
      this[y] = b;
      return this;
    };

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
    var sid = $routeParams.sid != undefined ? parseInt($routeParams.sid, 10) : 0;
    if (sid > 0) {
      var survey = ODlink.api.getQuestionlist();
      if (survey != null && sid == survey.surveyId) {
        $scope.jsonObj = survey;
        $scope.jsonObj.questionDtos[0].edit = true;

      }
      else {
        ODlink.api.questionlist(sid, function(error, data) {

          if (error) {
            /* */

          }
          else {

           // ODlink.api.setQuestionlist(null);
            ODlink.api.setQuestionlist(data.questionnaireDetailDto);
            $scope.jsonObj = data.questionnaireDetailDto;  
           // $scope.sort();
            //console.log(JSON.stringify(data));
            $scope.jsonObj.questionDtos[0].edit = true; 
            //$scope.$digest();

          }
        });
      }
    }
    else {
      var survey = '{"questionnaireDetailDto":{"endDate":"","surveyId":0,"expiryPeriod":0,"lastUpdate":"","startDate":"","surveyDescription":"","surveyName":"","questionDtos":[],"surveyRewardDto":{"rewardId":0,"rewardCode":"","rewardName":"","rewardDescription":"","rewardValue":0,"expiryPeriodInDays":0,"imageUrlLink":""}}}';
        var data = JSON.parse(survey);
        ODlink.api.setQuestionlist(data.questionnaireDetailDto);
        $scope.jsonObj = data.questionnaireDetailDto;
        if (ODlink.session.getShowDialog()  == "true") {
          ODlink.session.setShowDialog(false);
          alertify.alert("", function() {}).set({transition : 'undefined', message : 'Please click <a  onclick="jQuery(\'.ajs-close\').click();jQuery(\'#editsurvey\').click();">here</a> to add new survey.'}).set('title', 'Odilink').show();         
        }
    }

    var w = angular.element(".view");
    var con = angular.element("body > div.container");
    var win = angular.element($window).height();

    $scope.container = {width: con.width() + 30, height: win - 85};    
    $scope.edit_expand = "col-md-12";
    $scope.isclose = false;
    $scope.position = 0;
    $scope.widgetqueue = [];    
    $scope.isUndo = false;
    $scope.titlequeue = [];
    $scope.istitleUndo = false;
    $scope.tempQuestion = null;
    $scope.collapse_status = "angle-double-down";     
    $scope.tooltop = "expand survey";

    $scope.viewWidth = w.width() + padding;
    $scope.viewHeight = w.height();
    $scope.titlePlaceholder = "Start typing question here";
    $scope.mulitple = {};
    $scope.choiceText = {text : ''};
    $scope.progressOpt = {
        min : 0,
        max : 100,
        step : 10,
        value : 50
    }
      
    $scope.containerWidth = con.width();    
    //$scope.containerHeight =  angular.element(window).height();
    $scope.scroll = '';

    $scope.editRate = $scope.viewWidth > 925 ? 0.5 : 1 ;
    $scope.paneConfig = {
        verticalDragMinHeight: 20,
        verticalDragMaxHeight: 50,
        autoReinitialise : true,
        autoReinitialiseDelay : 300,
        showArrows : true,
        hideFocus: true
    }
    
    $scope.stars = [
      {
        value : '5 stars'
      },
      {
        value : '10 stars'
      }
    ];

    $scope.rating = {selected : $scope.stars[0]};

    $scope.numopt = [
      { value : '0 - 5' },
      { value : '0 - 10' },
      { value : '1 - 5' },
      { value : '1 - 10' },
    ];
    $scope.numberscale = {selected :  $scope.numopt[0]};

    $scope.slideropt = [
      { value: '0 - 10' },
      { value: '0 - 100' },
      ];

    $scope.slider = {selected : $scope.slideropt[0]}
    $scope.timelist = [];

    $scope.week_days = [
        {  value:'MON' },
        {  value:'TUE' },
        {  value:'WEN' },
        {  value:'THU' },
        {  value:'FRI' },
        {  value:'SAT' },
        {  value:'SUN' }
    ];

    $scope.dropSettings = {
            multiple : true,
            onDrop : 'dropCallback',          
    };
    $scope.key = '';

    $scope.ismeridian = true;
    $scope.today = new Date();

    $scope.dateformat = "yyyy/MM/dd";    
    $scope.header = true;
    $scope.question_template = {
                    questionId : 0,
                    orderSequence: 1,
                    text: $scope.titlePlaceholder,
                    answerOptionDtos:[],
                    questionTypeDto : {
                      questionType:''
                    }
                };     
    

    $scope.keywords=[{
      type : 'text',
      value:''
    }];

    $scope.variables = {
      choice : false,
      progress : 3,
      stars : 5,
      notice : ''
    }

    $scope.answerWidget = [
     {
          type:"RADIO_BUTTON",              
           options:[
                   { optionId:0,
               value:'Radio Button',
               answerOptionKeywordDtos:[]
              }
              ]
      },
      {
            type: 'CHECK_BOX',
               options:[
                   { optionId:0,
               value:'Checkbox',
               answerOptionKeywordDtos:[]
            }
            ]
      },
      {
             type: 'YES_NO',
              options:[
                  {
               optionId:0,
               value:'Yes',
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:'No',
               answerOptionKeywordDtos:[]
            }
              ]
      },
      {
             type: 'TIME',
              options:[
                  {
               optionId:0,
               value:'No',
               answerOptionKeywordDtos:[]
            }                           
              ]
      },
      {
             type: 'TEXTFIELD',
             options:[
                   {
               optionId:0,
               value:'Text Field',
               answerOptionKeywordDtos:[]
                }                 
             ]
      },
      
      {
              type: 'WEEK_DAYS',
              title:'Multiple Choice',
              options:[
                 {
               optionId:0,
               value:'Multiple Choice',
               answerOptionKeywordDtos:[]
                }
              ]
      },
      {
             type: 'CALENDAR',
              options:[
                {
                 optionId:0,
                 value:$filter('date')(new Date(), 'yyyy/MM/dd'),
                 answerOptionKeywordDtos:[                   
                 ]
               }

              ]
      },
      {
             type: 'TEXTBOX',
             options:[
                {
                 optionId:0,
                 value:'TextBox',
                 answerOptionKeywordDtos:[]
                  }                
             ] ,
             class:'col-md-12'            

      },      
      {
             type: 'PROGRESS_BAR_10',
             options:[
                   {
                 optionId:0,
                 value:'0',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'1',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'2',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'3',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'4',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'5',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'6',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'7',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'8',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'9',
                 answerOptionKeywordDtos:[]
                  },              
                  {
                 optionId:0,
                 value:'10',
                 answerOptionKeywordDtos:[]
                  }
             ]   ,
             class:'sliderpart'          

      },
      {
        type:'STAR_RATING_BAR',
        options:[ {
                 optionId:0,
                 value:'1',
                 answerOptionKeywordDtos:[]
                  },
                  {
                 optionId:0,
                 value:'2',
                 answerOptionKeywordDtos:[]
                  },
                  {
                 optionId:0,
                 value:'3',
                 answerOptionKeywordDtos:[]
                  },
                  {
                 optionId:0,
                 value:'4',
                 answerOptionKeywordDtos:[]
                  },
                  {
                 optionId:0,
                 value:'5',
                 answerOptionKeywordDtos:[]
                  }
                    ],
        class:'ratingpart'
      },
      {
        type:'LIKERT_SCALE_GOOD',
        options:[
            {
               optionId:0,
               value:"very bad",
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:"bad",
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:"neutral",
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:"good",
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:"very good",
               answerOptionKeywordDtos:[]
            }
           
        ],
        
      },
      {
        type:'NUMBER_SCALE_0_5',
        options:[{
               optionId:0,
               value:0,
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:1,
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:2,
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:3,
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:4,
               answerOptionKeywordDtos:[]
            },
            {
               optionId:0,
               value:5,
               answerOptionKeywordDtos:[]
            }
            ],
       
      }
      
    ];

    $scope.notes = [
      {
        type:'note',
        options:[{
          text:'Text'
        }],
      }
    ];
    
/*  
     $scope.jsonObj = {
            questions:[
      {
         questionId:0,
         text:"What is your zipcode?",
         orderSequence:1,
         answerOptionDtos:[
            {
               optionId:0,
               value:"",
               answerOptionKeywordDtos: [
                       
              ]
            }
         ],
         questionTypeDto:{
            questionType:"TEXTFIELD"
         }
      },        

      {
         questionId:0,
         text:"How many people were in your party?",
         orderSequence:2,
         answerOptionDtos:[
            {
               optionId:0,
               value:"Just yourself",
               answerOptionKeywordDtos: [
                               
              ]
            },
            {
               optionId:0,
               value:"Two people",
               answerOptionKeywordDtos: [
                               
              ]
            },
            {
               optionId:0,
               value:"Three people",
               answerOptionKeywordDtos: [
                               
              ]
            },
      {
               optionId:0,
               value:"Four or More people",
               answerOptionKeywordDtos: [
                               
              ]
            }            
         ],
         questionTypeDto:{
            questionType:"RADIO_BUTTON"
         }
      },

      {
         questionId:0,
         text:"How did you dine with us?",
         orderSequence:3,
         answerOptionDtos:[
            {
               optionId:0,
               value:"Drive Thru",
               answerOptionKeywordDtos: [
                               
              ]
            },
            {
               optionId:0,
               value:"Dine In",
               answerOptionKeywordDtos: [
                               
              ]
            },
            {
               optionId:0,
               value:"Carry Out",
               answerOptionKeywordDtos: [
                               
              ]
            }
         ],
         questionTypeDto:{
            questionType:"RADIO_BUTTON"
         }
      },      
      
      {
         questionId:0,
         text:"What did you order today?",
         orderSequence:4,
         answerOptionDtos:[
            {
               optionId:0,
               value:"Appetizers",
               answerOptionKeywordDtos: [
                               
              ]
            },
            {
               optionId:0,
               value:"Beverages",
               answerOptionKeywordDtos: [
                                       
              ]
            },
            {
               optionId:0,
               value:"Entree",
               answerOptionKeywordDtos: [
                               
              ]
            }
         ],
         questionTypeDto:{
            questionType:"CHECK_BOX"
         }
      },
{
         questionId:0,
         text:"What day do you visit more often?",
         orderSequence:5,
         answerOptionDtos:[
      {
               optionId:0,
               value:"",
               answerOptionKeywordDtos: [
                               
              ]
            }
         ],
         questionTypeDto:{
            questionType:"WEEK_DAYS"
         }
      }, 
      
      {
         questionId:0,
         text:"What time do you visit more often?",
         orderSequence:6,
         answerOptionDtos:[
      {
               optionId:0,
               value:"",
              answerOptionKeywordDtos: [
                               
              ]
            }
         ],
         questionTypeDto:{
            questionType:"TIME"
         }
      },       
      {
         questionId:0,
         text:"Did you experience any problems during your recent visit?",
         orderSequence:7,
         answerOptionDtos:[
            {
               optionId:0,
               value:"Yes",
               answerOptionKeywordDtos: [
               {keywordId: 0,
                keyword: "AMBIENCE"},
               {keywordId: 0,
                keyword: "PARKING"},
               {keywordId: 0,
                keyword: "ETC"}
                               
              ]
            },
            {
               optionId:0,
               value:"No",
               answerOptionKeywordDtos: [
                                       
              ]
            }
         ],
         questionTypeDto:{
            questionType:"YES_NO"
         }
      },
      {
         questionId:0,
         text:"Date when you would most likely visit us again?",
         orderSequence:8,
         answerOptionDtos:[
            {
               optionId:0,
               value:"",
               answerOptionKeywordDtos: [
                                       
              ]
            }
         ],
         questionTypeDto:{
            questionType:"CALENDAR"
         }
      },      
      {
         questionId:0,
         text:"Please tell us how we can improve?",
         orderSequence:9,
         answerOptionDtos:[
            {
               optionId:0,
               value:"",
               answerOptionKeywordDtos: [
                        {keywordId: 0,
                         keyword: "IMPROVE AMBIENCE"},
                        {keywordId: 0,
                         keyword: "IMPROVE PARKING"},
                        {keywordId: 0,
                         keyword: "IMPROVE ETC"}
                                       
              ]
            }
         ],
         questionTypeDto:{
            questionType:"TEXTBOX"
         }
      },      
      
      
      {
         questionId:0,
         text:"How likely are you going to recommend restaurant to a friend or colleague?",
         orderSequence:10,
         answerOptionDtos:[
            {
               optionId:0,
               value:"very bad",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"bad",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"neutral",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"good",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"very good",
               answerOptionKeywordDtos: [
                                               
              ]
            }/*,
            {
               optionId:0,
               value:"5",
               answerOptionKeywordDtos: [
                                               
              ]
            }
         ],
         questionTypeDto:{
            questionType:"LIKERT_SCALE_5"
         }
      },
      {
         questionId:0,
         text:"How likely are you to visit us next time?",
         orderSequence:11,
         answerOptionDtos:[
            {
               optionId:0,
               value:"0",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"1",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"2",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"3",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"4",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"5",
               answerOptionKeywordDtos: [
                                               
              ]
            }           
         ],
         questionTypeDto:{
            questionType:"NUMBER_SCALE_5"
         }
      },
          
      
      {
         questionId:0,
         text:"Did the staff member you interacted with say please and thank you?",
         orderSequence:12,
         answerOptionDtos:[
      {
               optionId:0,
               value:"Yes",
               answerOptionKeywordDtos: [
                                               
              ]
            },
            {
               optionId:0,
               value:"No",
               answerOptionKeywordDtos: [
                                               
              ]
            }
         ],
         questionTypeDto:{
            questionType:"YES_NO"
         }
      }
        
      
      
   ]
     };
*/

     

     $scope.dateOptions = {
     };

       $scope.publish = function (size) {

        var isopen = true;
        if (typeof $scope.jsonObj.questionDtos != 'undefined') {
          if ($scope.jsonObj.questionDtos.length == 0) 
            isopen = false;
          
          angular.forEach($scope.jsonObj.questionDtos, function(item, key) {
                if (item.answerOptionDtos.length == 0 && item.text == $scope.titlePlaceholder) {
                    isopen = false;
                    return false;
                }
          });
        } else {
          isopen = false;
        }

        if (isopen) {
            var modalInstance = $modal.open({
              templateUrl: 'tpl/modal/publishmodal.html',
              controller: 'PublishmodalCtrl',
              size: size,
              resolve: {  
                items: function() {
                    return $scope.jsonObj;
                } 
              }
            });

            modalInstance.result.then(function () {
             // $scope.selected = selectedItem;
            }, function () {
             // $log.info('Modal dismissed at: ' + new Date());
            });
        } else {
          alertify.alert("", function() {}).set({transition : 'undefined', message : 'Survey is empty. Please create.'}).set('title', 'Odilink').show();                   
        }
        
      };

    $scope.create_question = function() {

      if (angular.element("#editView").find(".label-alert").length > 0) 
        return
      var count = $scope.jsonObj.questionDtos.length;            
      var ques  = $scope.jsonObj.questionDtos[count-1];

      // check answer
      if (!(ques.answerOptionDtos.length == 0 && ques.text == '')) {

        // push new template
        $scope.jsonObj.questionDtos.push(angular.copy($scope.question_template));     

        // add sequence value
        $scope.jsonObj.questionDtos[count].orderSequence = (count + 1);      

        // edit value should set question
        angular.forEach($scope.jsonObj.questionDtos, function(question) {
          question.edit = false;   
        });
    //    +
       // .

        $scope.jsonObj.questionDtos[count].edit = true;
        $scope.jsonObj.questionDtos[count].text = $scope.titlePlaceholder;

        $scope.position = count;
        
        var pos = jQuery(jQuery('.view .question')[count - 1]).position();
        
        jQuery("body,html").animate({scrollTop: pos.top}, "slow");
        //angular.element(window).scrollTop(pos.top + 300);
      }
      
    };

    $scope.show_edit = function(){
            $scope.edit_expand = "col-md-6";
            $scope.isclose = true;
            if ($scope.isclose) {
              if ($scope.jsonObj.questionDtos.length == 0) {
                $scope.jsonObj.questionDtos.push(angular.copy($scope.question_template));
                $scope.jsonObj.questionDtos[0].edit = true;
              }
                  /*var api = angular.element('.scroll-pane').data('jsp');
                  var w = angular.element(window);                 
                  angular.element('.jspContainer').height(w.height());
                  angular.element('.jspContainer').width(400);
                  api.reinitialise();*/
                  

            }
//            $scope.tempQuestion = angular.copy($scope.jsonObj.questionDtos[ $scope.position]);      
    };

    $scope.close_edit = function() {
      $scope.edit_expand = "col-md-12";
      $scope.isclose = false;
    };

  /*  $scope.nextstep = function () {
        	var len = $scope.jsonObj.questionDtos.length;
        	
        	if ($scope.jsonObj.questionDtos[ $scope.position]) {
        		$scope.jsonObj.questionDtos[ $scope.position].edit = false;

        	}
        	else {
            	for(var i=$scope.jsonObj.questionDtos.length;i--;)
	        	{            	
	                if ($scope.jsonObj.questionDtos[i].edit) {
	                     	$scope.position = i;                	
	                	//break;
	                }      
                  $scope.jsonObj.questionDtos[i].edit = false;          
	            }
        	}

            $scope.position ++;
            if ($scope.position >= len) {
            	$scope.position = 0;
            }
            $scope.jsonObj.questionDtos[$scope.position].edit = true;
        };*/

      $scope.editMode = function (current) {
            $scope.position = current;
            for(var i=$scope.jsonObj.questionDtos.length;i--;)
            {
                $scope.jsonObj.questionDtos[i].edit = false;
            }

            $scope.jsonObj.questionDtos[current].edit = true;
            $scope.variables.notice = "notice";
          //  if ($scope.jsonObj.questionDtos[current].text == $scope.titlePlaceholder)

           // $scope.tempQuestion = angular.copy($scope.jsonObj.questionDtos[current]);
      };

     
     $scope.refresh_edit = function() {            
            //if ($scope.tempQuestion != null) {            

              var question = $scope.jsonObj.questionDtos[$scope.position];
              if (typeof question !== 'undefined') {
                question.text = $scope.titlePlaceholder;
                question.answerOptionDtos = [];   
                question.questionTypeDto.questionType = ""; 
              }
              
              /** **/
             $scope.variables.notice = 'notice';
            //}            
        };

      $scope.delete_question = function(ques) {

          if (typeof ques === 'undefined') {

              $scope.jsonObj.questionDtos = []; 
              $scope.close_edit();
          }

          else {
            var editable  = false;
             $scope.jsonObj.questionDtos.splice(ques.orderSequence - 1, 1);
                   
            for(var i=1; i <= $scope.jsonObj.questionDtos.length;i++)
            {
                  $scope.jsonObj.questionDtos[i-1].orderSequence = i;
                  if ($scope.jsonObj.questionDtos[i-1].edit == true)
                    editable = true;
            }
            
            if ($scope.jsonObj.questionDtos.length == 0)
            {
              $scope.jsonObj.questionDtos.push(angular.copy($scope.question_template));
            }

            $scope.position = 0;

            if (!editable) 
              $scope.jsonObj.questionDtos[0].edit = true;             
          }

        };

    $scope.dropCallback = function(data, evt){     
        var elem = angular.element(evt.draggable);
        var pos = elem.attr('answer');
        var keypos = elem.attr('keywords');
        var notepos = elem.attr('notes');       
        var add = false;        
        var question = $scope.jsonObj.questionDtos[$scope.position];
        
        var qpos = question.answerOptionDtos.length;

        if (pos != "" && typeof pos !== 'undefined') {
          pos = parseInt(pos);         

          // answer options is blank. 
          if (question.answerOptionDtos.length == 0 || typeof question.answerOptionDtos[0] === 'undefined') {

            // add option to answerOptionDtos
            question.answerOptionDtos = angular.copy($scope.answerWidget[pos].options); 
            question.questionTypeDto.questionType = $scope.answerWidget[pos].type;

            switch (question.questionTypeDto.questionType) {
              case "TEXTFIELD":
              case "TEXTBOX":
                question.answerOptionDtos[0].value = "";
              break;
              case "RADIO_BUTTON":
              case "CHECK_BOX":
                question.answerOptionDtos[0].value = "";
                question.answerOptionDtos[0].focus = true;
              break;
              case "WEEK_DAYS":
                 $scope.mulitple = question.answerOptionDtos[0];
                 break;
            }                        
          }
          else {

            // check type
            var type = question.questionTypeDto.questionType;            
            if (type == "YES_NO" && $scope.answerWidget[pos].type == "RADIO_BUTTON") {
              question.questionTypeDto.questionType == "RADIO_BUTTON";

              var isInsert = true;
              angular.forEach(question.answerOptionDtos, function(item, key) {
                  if (item.value.trim() == "") {
                    isInsert = false;
                    return false;
                  }
              });

              if (isInsert) {
                var insert = angular.copy($scope.answerWidget[pos].options[0]);
                insert.focus = true;
                insert.value = "";
                question.answerOptionDtos.push(insert);
              }


            }            
            else if (question.questionTypeDto.questionType == $scope.answerWidget[pos].type) {
              if (question.questionTypeDto.questionType == 'RADIO_BUTTON' ||
                question.questionTypeDto.questionType == 'CHECK_BOX') {

                var isInsert = true;
                angular.forEach(question.answerOptionDtos, function(item, key) {
                    if ("" == item.value.trim()) {
                      isInsert = false;
                      return false;
                    }
                });

              if (isInsert) {
                var insert = angular.copy($scope.answerWidget[pos].options[0]);
                insert.value = "";
                insert.focus = true;
                question.answerOptionDtos.push(insert);
              }

              }
              else if (question.questionTypeDto.questionType == 'TIME') {                
                  question.answerOptionDtos.push(angular.copy($scope.answerWidget[pos].options[0]));
              }  
            }
            else {
               alertify.alert().set({transition : 'undefined', message : 'Not allowed. Please use the same answer type.'}).set('title', 'Odilink').show(); 
            }
          }
          //add = true;
        }
        /*Int(keypos);          
          var input = $scope.keywords[keypos].value;

          var option = elem.attr("option");

          if (typeof option !== 'undefined') {

              
          }

          
          //question.body.push(angular.copy($scope.keywords[keypos]));
          //add = true;
        }
        else if (notepos != "") {
          notepos = parseInt(notepos);          
          //question.body.push(angular.copy($scope.notes[notepos]));
         // add = true;
        }        */ 

// undo redo
        /*if (add) {
          $scope.managequeue(question.body[qpos],
            qpos, '-', 'undo');
        }*/
     };

     $scope.remove = function(queue, index) {
       // $scope.managequeue(queue.body[index], index, '+', 'undo');
        //var question = $scope.jsonObj.questionDtos[$scope.position];
        switch (queue.questionTypeDto.questionType) {
          case "WEEK_DAYS":
          case "COMBO":
          case "MONTH":
          case "PROGRESS_BAR_10":
          case "PROGRESS_BAR_100":
          case "STAR_RATING_BAR":
          case "STAR_RATING_BAR":
          case "LIKERT_SCALE_GOOD":
          case "NUMBER_SCALE_0_5":
          case "NUMBER_SCALE_1_5":
          case "NUMBER_SCALE_0_10":
          case "NUMBER_SCALE_1_10":
          case "LIKERT_SCALE_AGREE":
          case "LIKERT_SCALE_GOOD":
          case "LIKERT_SCALE_LIKELY":
          case "LIKERT_SCALE_SATISFIED":
          case "LIKERT_SCALE_OTHER":
            queue.answerOptionDtos = [];
            queue.questionTypeDto.questionType = "";
          return;  
        }
        
        if (typeof index !== 'undefined') {     
          if (queue.answerOptionDtos.length == 1) {
            queue.answerOptionDtos = [];
          } 
          else {    
            queue.answerOptionDtos.splice(index, 1); 
          }
        }
        else {          
          queue.answerOptionDtos = [];
        }
     };
/*
     $scope.increase = function(question, $index) {

     };

     $scope.managequeue = function(obj, index, operate, type) {
        var data = {
          operate : operate,
          position : index,
          obj : obj,
          type : type 
        };
        
        if ($scope.isUndo) {
          $scope.widgetqueue = [];
          $scope.isUndo = false;
        }

        if ($scope.widgetqueue.length >= g_queue_count) {
          $scope.widgetqueue.splice(0, 1);
        }

        $scope.widgetqueue.push(data);
     };

     $scope.undo = function(question, type) { 
        $scope.isUndo = true;
        if ($scope.widgetqueue.length > 0) {          
            var data = null;
            if (type == "undo") {
              data = $scope.widgetqueue[$scope.widgetqueue.length - 1];                
            }
            else {
              data = $scope.widgetqueue[0];   
            }
            

            if (data.type == type) {
              if (data.operate == "+") {
                question.body.splice(data.position, 0, data.obj);                                
              }
              else {
               question.body.splice(data.position, 1);                                
              }              
            } else {
              return;
            }

            data.operate = (data.operate == "+") ? '-' : '+';
            if (type == 'undo') {
              data.type = 'redo';
              $scope.widgetqueue.splice($scope.widgetqueue.length - 1, 1);                
              $scope.widgetqueue.splice(0, 0, data);
            }
            else {
              data.type = 'undo';
              $scope.widgetqueue.push(data);                
              $scope.widgetqueue.splice(0, 1); 
            }           
            
          }
     };

    */
      var wscrolltop = 0;
       $scope.sortableOptions = {
        'ui-floating': true,
        start: function(event, ui) {
          wscrolltop = $(window).scrollTop();
        },
        placeholder: 'placeholder-class',
        stop: function(e, ui) {

           angular.forEach($scope.jsonObj.questionDtos, function(question, id) {
            question.orderSequence = id + 1;
          });
        },
         sort: function(event, ui) {  
         ui.helper.css({'top' : ui.position.top + wscrolltop + 'px'});
        }
    };

    $scope.editSortableOptions = {
        'ui-floating': true,      
         sort: function(event, ui) {  
        ui.helper.css({'top' : ui.position.top + $(window).scrollTop() + 'px'});
      }
    };

    /*$scope.checkTitle = function(val) {
      //console.log(val);

        if ($scope.istitleUndo) {
          $scope.titlequeue = [];
          $scope.istitleUndo = false;
        }

        var cnt = $scope.titlequeue.length;
        if (cnt >= g_queue_count) {
          $scope.titlequeue.splice(0, 1);
        }

        if (cnt > 0) {
          if ($scope.titlequeue[cnt-1] != val) {
            $scope.titlequeue.push({type:'undo', text:val});
          }
        }
        else {
          $scope.titlequeue.push({type:'undo', text:val});
        }
    };*/

   /* $scope.titleUndo = function(question, type) {
      var data = null;
      for(var i = 0 ;i <  2; i++) {

        if ($scope.titlequeue.length > 0) {
          if (type == "undo") {
            data = $scope.titlequeue[$scope.titlequeue.length - 1];
            if (data.type == type) {
              data.type = 'redo';
              question.title = data.text;
              $scope.titlequeue.splice($scope.titlequeue.length - 1, 1);
              $scope.titlequeue.splice(0, 0, data);
            }
          }  
          else {
            data = $scope.titlequeue[0];   
            if (data.type == type) {
              data.type = 'undo';
              question.title = data.text;
              $scope.titlequeue.push(data);                
              $scope.titlequeue.splice(0, 1);
            }
          }
        }
        
        if ($scope.istitleUndo) {
          break;
        }

        $scope.istitleUndo = true;
      }        
    };*/

    /* timer */
    $scope.hstep = 1;
    $scope.mstep = 15;

    /* datetime */
    $scope.open = function($event, body) {
      $event.preventDefault();
      $event.stopPropagation();

      body.opend = true;
    };

/*    $scope.print = function() {
      window.print();
    };*/

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

    $scope.duplicate = function(que) {
      if (typeof que !== 'undefined') {
        $scope.jsonObj.questionDtos.push(angular.copy(que));


        for(var i=1; i <= $scope.jsonObj.questionDtos.length;i++)
        {
            $scope.jsonObj.questionDtos[i-1].orderSequence = i;            
            $scope.jsonObj.questionDtos[i-1].edit = false;
        }
         
        que.edit = true;   
      }
    };

    $scope.addKeyword = function(answerOption, input, ques) {

      var arr = typeof answerOption !=='undefined' ? answerOption.answerOptionKeywordDtos : [];
      switch (ques.questionTypeDto.questionType) {
        case "WEEK_DAYS":
        case "MONTH":
        case "COMBO":
        case "PROGRESS_BAR_10":
        case "PROGRESS_BAR_100":
        case "STAR_RATING_BAR":
        case "LIKERT_SCALE_GOOD":
        case "NUMBER_SCALE_1_5":
        case "NUMBER_SCALE_0_5":
        case "NUMBER_SCALE_1_10":
        case "NUMBER_SCALE_1_10":
          arr = ques.answerOptionDtos[0].answerOptionKeywordDtos;
        break;
      }
            if (input != '') {
              var filter = true;
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].keyword == input) {
                  filter = false;
                }
              }             
              if (filter) {
                arr.push(
                  {
                    keywordId: 0,
                    keyword: input
                  }
                  );  
              }              
            } 
    };

    $scope.collapse = function(obj) {
      $scope.collapse_status = $scope.collapse_status != "angle-double-up" ? "angle-double-up" : "angle-double-down";
      $scope.tooltop = $scope.collapse_status != "angle-double-up" ? "expand survey" : "collapse survey";
      angular.element(obj).attr('tooltip', $scope.tooltip);
    }
    
    $scope.addAnwser = function(que, indx) {

      if (que.questionTypeDto.questionType == 'TIME') {       
        que.answerOptionDtos.splice(indx + 1, 0,  {
               optionId:0,
               value:" ",             
               answerOptionKeywordDtos: [                       
              ]
            });
      }

      var isInsert = true;
      var text = que.answerOptionDtos[indx].value.trim().toLowerCase();

      angular.forEach(que.answerOptionDtos, function(item, key) {
        var label = item.value.trim().toLowerCase();
        if (label == "") {
          isInsert = false;
          return false;
        }        

        if (indx != key && label == text) {
          isInsert = false;
          return false;
        }
      });

      if (!isInsert) {
        return;
      }

      

      var answer = {
               optionId:0,
               value:" ",             
               answerOptionKeywordDtos: [                       
              ]
            };

      answer.focus = true;
      
        que.answerOptionDtos.splice(indx + 1, 0, answer);
    }


    $scope.$watch('edit_expand', function(newVal, oldVal) {
      if (newVal == "col-md-12") {
       /* var w = angular.element(".view");
        var w1 = angular.element(".edit");
        if (w > w1)*/
          
            $scope.containerWidth = $scope.container.width - padding; 
          
        
      }
      else {     
        var w = angular.element(".view");
        if (w.width() > 920)
          $scope.containerWidth = $scope.container.width / 2 - padding;
        else 
          $scope.containerWidth = w.width();
      }
    });

    $scope.onselect = function(model, arr, question) {
      var i = arr.indexOf(model.selected);
      var len = (i + 1) * 5;
      var keyword = question.answerOptionDtos[0].answerOptionKeywordDtos;
      question.answerOptionDtos = [];
      for (var j = 1; j <= len; j++) {
        question.answerOptionDtos.push({
                 optionId:0,
                 value:j,
                 answerOptionKeywordDtos: [
                                                 
                ]
              });
      }

      $scope.variables.stars = len;
      question.answerOptionDtos[0].answerOptionKeywordDtos = keyword;

        question.questionTypeDto.questionType = 'STAR_RATING_BAR';
      //$scope.$apply();
    };

    $scope.changeLikert = function(question, type) {
      switch(type) {
        case "agree":
          question.answerOptionDtos[0].value = "strongly disagree";
          question.answerOptionDtos[1].value = "disagree";
          question.answerOptionDtos[2].value = "neutral";
          question.answerOptionDtos[3].value = "agree";
          question.answerOptionDtos[4].value = "strongly agree";
          question.questionTypeDto.questionType = 'LIKERT_SCALE_AGREE';
        break;
        case "likely":
          question.answerOptionDtos[0].value = "highly unlikely";
          question.answerOptionDtos[1].value = "unlikely";
          question.answerOptionDtos[2].value = "neutral";
          question.answerOptionDtos[3].value = "likely";
          question.answerOptionDtos[4].value = "highly    likely";
          question.questionTypeDto.questionType = 'LIKERT_SCALE_LIKELY';
        break;
        case "satisfied":
          question.answerOptionDtos[0].value = "highly dissatisfied";
          question.answerOptionDtos[1].value = "dissatisfied";
          question.answerOptionDtos[2].value = "neutral";
          question.answerOptionDtos[3].value = "satisfied";
          question.answerOptionDtos[4].value = "highly satisfied";
          question.questionTypeDto.questionType = 'LIKERT_SCALE_SATISFIED';
        break;
      }
    };

    $scope.onselect1 = function(num, ques) {
      var val = num.selected.value.split('-');
      var min = parseInt(val[0]);
      var max = parseInt(val[1]);
      var i = 0;
      var keyword = ques.answerOptionDtos[0].answerOptionKeywordDtos;
      ques.answerOptionDtos = [];
      while (min <= max) {
        ques.answerOptionDtos.push({
            optionId:0,
            value:min,
            answerOptionKeywordDtos: []
        });

        min += 1;
        i += 1;
      }

      switch (num.selected.value) {
        case "0 - 5":
          ques.questionTypeDto.questionType = "NUMBER_SCALE_0_5";
        break;
        case "0 - 10":
          ques.questionTypeDto.questionType = "NUMBER_SCALE_0_10";
        break;
        case "1 - 5":
          ques.questionTypeDto.questionType = "NUMBER_SCALE_1_5";
        break;
        case "1 - 10":
          ques.questionTypeDto.questionType = "NUMBER_SCALE_1_10";
        break;
      }
      ques.answerOptionDtos[0].answerOptionKeywordDtos = keyword;
    };

    $scope.setChoice = function(ques, type) {
      $scope.variables.choice = false;

      if (type == "week") {
        ques.answerOptionDtos = [
          {
               optionId:0,
               value:"MON",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"TUE",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"WEN",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"THU",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"FRI",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"SAT",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"SUN",
               answerOptionKeywordDtos: []
          }
          ];
          ques.questionTypeDto.questionType = "WEEK_DAYS";
      }
      else {
          ques.answerOptionDtos = [
          {
               optionId:0,
               value:"Jan",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Feb",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Mar",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Apr",
               answerOptionKeywordDtos: []
          },  
          {
               optionId:0,
               value:"May",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Jun",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Jul",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Aug",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Sep",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Oct",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Nov",
               answerOptionKeywordDtos: []
          },
          {
               optionId:0,
               value:"Dec",
               answerOptionKeywordDtos: []
          }
          ];

          ques.questionTypeDto.questionType = "MONTH";
      }

      $scope.mulitple = ques.answerOptionDtos[0];
    };

    $scope.addChoice = function(ques, o) {
        
      if (o.value !== '') {
          /*var filter = true;
          angular.forEach(ques.answerOptionDtos, function(item) {
            if (item.value == $scope.choiceText.text) {
              filter = false;
            }            
          });*/          
          var item =   {
                       optionId:0,
                       value:'',
                       answerOptionKeywordDtos: []
                  };
                ques.answerOptionDtos.push(
                  item
                  );  
          $scope.mulitple = item;
          //ques.questionTypeDto.questionType = "COMBO";
      }

    };

    $scope.addCombo = function(ques) {

   
      if ($scope.choiceText.text !== '') {         
            $scope.variables.combo = ques.answerOptionDtos[0].answerOptionKeywordDtos;
      ques.answerOptionDtos = [];
      ques.questionTypeDto.questionType = 'COMBO';

          var item =   {
                       optionId:0,
                       value:$scope.choiceText.text,
                       answerOptionKeywordDtos: []
                  };
          item.answerOptionKeywordDtos = $scope.variables.combo;
          ques.answerOptionDtos.push(
                  item
                  );  
                item =   {
                       optionId:0,
                       value:'',
                       answerOptionKeywordDtos: []
                  };
                ques.answerOptionDtos.push(
                  item
                  );  

          $scope.mulitple = item;
          $scope.choiceText.text = '';
      }

    };

    $scope.onselect2 = function(ques) {
      var keyword = ques.answerOptionDtos[0].answerOptionKeywordDtos;
      if ($scope.slider.selected.value == $scope.slideropt[1].value) {

        ques.answerOptionDtos = [];
        for (var i = 0; i <= 100; i+= 10) {
          ques.answerOptionDtos.push({
            optionId:0,
            value:i,
            answerOptionKeywordDtos:[]
          });
        }
        $scope.variables.progress = 30;
        ques.questionTypeDto.questionType = "PROGRESS_BAR_100";
      }
      else {
        ques.answerOptionDtos = [];
        for (var i = 0; i <= 10; i+= 1) {
          ques.answerOptionDtos.push({
            optionId:0,
            value:i,
            answerOptionKeywordDtos:[]
          });
        }
        $scope.variables.progress = 3;
        ques.questionTypeDto.questionType = "PROGRESS_BAR_10";
      }
      ques.answerOptionDtos[0].answerOptionKeywordDtos = keyword;
    };

    $scope.removeChoice = function(question, o) {
      
      var i = 0;
      angular.forEach(question.answerOptionDtos, function(item) {
        if (item == o) {
          question.answerOptionDtos.splice(i, 1);
        }
        i++;
      });

      if (question.answerOptionDtos.length == 0) {
        question.answerOptionDtos.push({
          optionId:0,
            value:'',
            answerOptionKeywordDtos:[]
        });
        $scope.variables.choice = false;
        question.answerOptionDtos[0].answerOptionKeywordDtos = $scope.variables.combo;
      }

      $scope.mulitple = question.answerOptionDtos[question.answerOptionDtos.length - 1];
    };

    $scope.choiceSelect = function($item, $model, ques) {

      ques.selected = $item;
    };

    $scope.deleteKey = function($answer, $indx) {
      $answer.splice($indx, 1);
      if ($answer.length == 0) {
        $answer = [];
      }
    }
    /** scroll page **/
    angular.element($window).bind("scroll", function() {
      var width = jQuery(window).width();
         
      if (width > 975) {

        var currentScroll = jQuery(this).scrollTop();
       // console.log(currentScroll);

        var scrollpos = currentScroll - 72;

        if (scrollpos <= 0)  {
           scrollpos = 0;
           $scope.header = true;
        }
        else {
          $scope.header = false;
        }  


        var w = angular.element(".view");
        $scope.viewHeight = w.height();
       // console.log($scope.viewHeight);
        if (($scope.viewHeight  + 400 )  > scrollpos) {
         // $scope.scroll = 'height:' + $scope.containerHeight + 'px;'; 
          $scope.scroll = 'margin-top:' + scrollpos + 'px;';
        }       
      } 
        $scope.$apply();
    });



    /*angular.element($window).bind("resize", function(){
       var width = jQuery(window).width();      
        var w = angular.element(".view");
        $scope.viewWidth = w.width() + padding;
        $scope.containerHeight = jQuery(window).height();

        //console.log(width);
        if (width > 975 && $scope.edit_expand == "col-md-6")
          $scope.editRate = 0.5;
        else 
          $scope.editRate = 1;

        $scope.containerWidth = $scope.viewWidth * $scope.editRate - padding;
        
    }); 
*/  
    
    $scope.getNotice = function(question) {
      if (question.text == $scope.titlePlaceholder) {
        return 'notice';
      }
      return '';
    }
  });
