'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('HeaderCtrl', function ( $scope, ODlink, $compile, $modal) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*$scope.suverylist = null;
    function suggest_state(term) {
         var q = term.toLowerCase().trim(),
       results = [];

       for (var i = 0; i < $scope.suverylist.length; i++) {
         var survey = $scope.suverylist[i];
         if (survey.questionnaireName.toLowerCase().indexOf(q) !== -1 
            )
           results.push({
             value: survey.questionnaireName,
             // Pass the object as well. Can be any property name.
             obj: survey,
             label: survey.questionnaireName
           });
       }
      return results;
    }

    $scope.search = {};*/
    
    $scope.show = true;

    $scope.doSelect = function(typedthings) {
        $scope.sid = typedthings.questionnaireId;
        ODlink.api.setSurveyid($scope.sid);
        var path = '';
        switch (ODlink.api.getRoute()) {
          case 'ReportCtrl':
            path = 'report';
          break;
          case 'ReplyCtrl':
            path = 'reply';
          break;
          case 'MainCtrl':
          default:
            path = 'create';
          break;          
        }
        
        ODlink.session.path('/dashboard/' + path+ '/' + $scope.sid);
    }

    $scope.suverylist = null;
    
    $scope.$on('DO_LOGOUT',function(){
        $scope.loggin = false;
    });

    $scope.$on('DO_LOGIN',function(){
	    $scope.loggin =  ODlink.session.isAuthenticated();
      //questionnaireName
      $scope.suverylist = ODlink.api.getSurveylist();
      angular.forEach($scope.suverylist, function(item, key) {
        item.value = item.questionnaireName;        
      });
      //$scope.selectedSurvey = $scope.suverylist[$scope.suverylist.length - 1];
      $scope.sid = ODlink.api.getSurveyid();
	 });   

   $scope.$on('DO_REFRESH_HEADER', function() {

      switch (ODlink.api.getRoute()) {
          case 'ReplyCtrl':
            $scope.show = false;
          break;
          default :
            $scope.show = true;
          break;
      }
      
   });
 /*   $scope.$watchCollection('selectedSurvey', function(nval) {

        if (nval.label == nval.value && nval.key >= 0) {
          $scope.sid = $scope.suverylist[nval.key].questionnaireId;
          ODlink.api.setSurveyid($scope.sid);
          ODlink.session.path('/dashboard/create/' + $scope.sid);
        }
    });
*/  
    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/calendarModal.html',
        controller: 'CalendarmodalCtrl',
        size: size,
        resolve: {        
        }
      });
 
    modalInstance.result.then(function () {
//      $scope.selected = selectedItem;
    }, function () {
//      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  });

  
