'use strict';

/**
 * @ngdoc service
 * @name odilinkApp.ODlink
 * @description
 * # ODlink
 * Factory in the odilinkApp.
 */
angular.module('odilinkApp')
  .factory('ODlink', function ($q, odApi, odSession) {
    // Service logic
    // ...

    return window.ODlink = {
     
    // Exposes all modules.
    api: odApi,  
    session: odSession,
  

    // Loads basic modules.
    /*load: function() {
      var deferred = $q.defer();      
      return deferred.promise;
    },*/
    };

  });
