'use strict';

/**
 * @ngdoc service
 * @name odilinkApp.Focus
 * @description
 * # Focus
 * Factory in the odilinkApp.
 */

angular.module('odilinkApp')
  .factory('Focus', function ($rootScope, $timeout) {
    // Service logic
    // ...

    return function(name) {
      $timeout(function (){
        $rootScope.$broadcast('focusOn', name);
      });
    };
  });
