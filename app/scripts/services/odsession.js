'use strict';

/**
 * @ngdoc service
 * @name odilinkApp.odSession
 * @description
 * # odSession
 * Factory in the odilinkApp.
 */
angular.module('odilinkApp')
  .factory('odSession', function (Enviroment, $location, $window) {

    return {

    _user: null,    
    _profile: null,   
    position : [],
    _showDialog : null,

    host: function() {
      return Enviroment.host;
    },

    at: function(test) {
      if (test instanceof RegExp) {
        return test.test($location.path());
      } else if (angular.isString(test)) {
        return test === $location.path();
      }
    },

    back: function() {
      $window.history.back();
    },

    path: function(path) {
      var current = $location.path();
      if (path === '/') {
        path = '/create';
      } else if (!path) {
        path = current;
      }
      if (this.requiresAuthentication(path)) {
        $location.path('/signin');
      } else if (current !== path) {
        $location.path(path);
      }
    },

// - -------------------------------------------------------------------- - //

    save: function() {
      this._user = this._profile.userName;
      $window.localStorage.setItem('_user',this._user);
    },

    load: function() {
        var user = $window.localStorage.getItem('_user');
        if (angular.isString(user)) {
          this._user = user;
        }      
    },

    clear: function() {
      $window.localStorage.setItem('_user','');
      this._user = null;    
      this._profile = null;    
      this._showDialog = null;     
    },

// - -------------------------------------------------------------------- - //

    requiresAuthentication: function(path) {
      if (this.isAuthenticated()) {
        return false;
      } else {
        return !/sign\-in|sign\-up/.test(path);
      }
    },

    isAuthenticated: function() {
      return angular.isString(this._user);
    },


// - -------------------------------------------------------------------- - //

    setProfile: function(profile) {
      if (!angular.isObject(profile)) {
        throw new Error('invalid or missing profile');
      }
      this._profile = profile;
    },

    getProfile: function() {
      return this._profile;
    },

    setShowDialog : function(show) {
      this._showDialog = show;
      $window.localStorage.setItem('show',show);
    },

    getShowDialog : function() {
      var res = this._showDialog == null ? $window.localStorage.getItem('show') : this._showDialog;
      if (typeof res === 'undefined' || res == null) {
        res = "true";
      }

      return res;
    }
  };

  });
