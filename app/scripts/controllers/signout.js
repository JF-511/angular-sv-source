'use strict';

/**
 * @ngdoc function
 * @name odilinkApp.controller:SignoutCtrl
 * @description
 * # SignoutCtrl
 * Controller of the odilinkApp
 */
angular.module('odilinkApp')
  .controller('SignoutCtrl', function ($scope, $window, ODlink, $rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    ODlink.session.clear();
    ODlink.api.clear();
      
    $rootScope.$broadcast('DO_LOGOUT');
    ODlink.session.path('/');
  });
