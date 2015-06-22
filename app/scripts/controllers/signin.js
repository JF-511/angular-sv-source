'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('SigninCtrl', function ($scope, $rootScope, ODlink) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
   $scope.showError = function(err) {
     $scope.error = err;
     console.log(err);
  };

    $scope.signin = function() {
    	if ($scope.form.$valid) {
	      ODlink.api.signIn({
	        emailId: $scope.email,
	        password: $scope.password,
	      },function(error) {
	        if (error) {
	        	$scope.showError(error);
	          
	        } else {
	        	//
	        	/*ODlink.session.setProfile({
                userName: "test"                   
              });
              ODlink.session.save();*/
              //

            ODlink.api.surveylist(function(error, data) {
              if (!error) {
                

                if (typeof data.questionnaireRecordDtos !== "undefined") {
                  var list = data.questionnaireRecordDtos;
                  var len = data.questionnaireRecordDtos.length;
                  var sid = 0;
                  if (len > 0) {
                    sid = data.questionnaireRecordDtos[len - 1].questionnaireId;                          
                  }

                  ODlink.api.setSurveyid(sid);
                  ODlink.api.setSurveylist(data.questionnaireRecordDtos);                 
                  $rootScope.$broadcast('DO_LOGIN');
                  ODlink.session.path('/dashboard/create/' + sid);
                }
                else {
                  $rootScope.$broadcast('DO_LOGIN');
                  ODlink.session.path('/dashboard/create/'); 
                }
              }
              else {
                /* error part */
                if (data == 200) {
                  $rootScope.$broadcast('DO_LOGIN');
                  ODlink.session.path('/dashboard/create/');
                }
                else {
                  $scope.showError(error);
                }
              }
            });
	        }	      
	      });  
	  }
	};
    
  });
