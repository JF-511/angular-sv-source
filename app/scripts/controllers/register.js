'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('RegisterCtrl', function ($scope) {
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

    $scope.back = function() {
      $scope.registered = "";
      $scope.model = "";
      $scope.type =  "";
      $scope.city = "";
      $scope.country = "";
      $scope.email = "";
      $scope.imagefile = "";
      $scope.name = "";
      $scope.phonenumber = "";
      $scope.state = "";
      $scope.streetAddress = "";
      $scope.zip = "";
    };

    $scope.register = function() {
    	 if ($scope.form.$valid) {
          $scope.error = "";
        ODlink.api.register ({
        	 "companyId": 0,
			  "businessModel": $scope.model,
			  "businessType": $scope.type,
			  "city": $scope.city,
			  "country": $scope.country,
			  "email": $scope.email,
			  "imageLink": "test",
			  "name": $scope.name,
			  "phoneNumber": $scope.phonenumber,
			  "state": $scope.state,
			  "isActive": 0,
			  "streetAddress": $scope.streetAddress,
			  "website": $scope.website,
			  "zip": $scope.zip
        },function(error) {
          if (error) {
            $scope.showError(error);
          } else {
            $scope.registered = "Thanks for " + $scope.name + " register.";
          }
        });
    }

    };

  });
