'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('SignupCtrl', function ($scope, $rootScope, ODlink) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.registered = "";
   $scope.showError = function(err) {
     $scope.error = err;
     console.log(err);
  };

    $scope.signUp = function() {
    	 if ($scope.form.$valid) {
          $scope.error = "";
        ODlink.api.signUp ({
          firstName : $scope.firstname,
          lastName : $scope.lastname,
          email : $scope.email,  
          password : $scope.password,
          company : $scope.company, 
          phoneNum : $scope.phoneNum


        },function(error) {
          if (error) {
            $scope.showError(error);
          } else {
            //$rootScope.$broadcast('DO_LOGIN');
            //ODlink.session.path('/dashboard');
            $scope.registered = "Thanks for " + $scope.firstname + " " + $scope.lastname + " register.";
          }
        });
    }

    };
    
  });
