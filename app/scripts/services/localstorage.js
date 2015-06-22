'use strict';

/**
 * @ngdoc service
 * @name odilinkApp.localstorage
 * @description
 * # localstorage
 * Factory in the odilinkApp.
 */
angular.module('odilinkApp')
  .factory('localstorage', function ($window) {
    
    // Public API here
    return {     
        set: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
      }
    });
