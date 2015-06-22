'use strict';

/**
 * @ngdoc service
 * @name odilinkApp.odApi
 * @description
 * # odApi
 * Factory in the odilinkApp.
 */
angular.module('odilinkApp')
  .factory('odApi', function (odSession, $window,  $http) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {

      _surveyid : null,
      _questionlist : null,
      _serverlist : null,
      _report : null,
      _currentRoute : null,

      someMethod: function () {
        return meaningOfLife;
      },
    clear: function() {     
      this._surveyid = null;    
      this._questionlist = null;  
      this._serverlist = null;
      this._report = null;
      this._currentRoute = null; 
    },
    _call: function(options,callback) {
      var error = null;
      if (angular.isString(options)) {
        options = { url: options };
      }
      options.url = odSession.host() + options.url;
      if (!angular.isString(options.method)) {
        options.method = 'GET';
      }
      if (!angular.isObject(options.headers)) {
        options.headers = {            
           // 'Content-Type': 'application/x-www-form-urlencoded'            
        };
      }

      // Includes credentials if required.
      if (options.auth === true) {
        if (odSession.isAuthenticated()) {
          //options.headers['X-Auth-Token'] = odSession.getAuthToken();     
        } else {
          error = new Error('must be authenticated');
        }
      }

      if (error) {
        angular.isFunction(callback) && callback(error);
      } else {
        $http(options)
          .error(function(data,status) {
            if (status === 403) {
              odSession.clear();
            }
            angular.isFunction(callback) && callback(new Error(status));
          })
          .success(function(data,status,headers) {

            if (data.statusMessage == "Login Denied"){
              error = data.statusMessage;
            }
            else if (data.status === 'NOT_OK') {
              error = data.statusMessage;
            }
            else {
              error = '';
            }

            // Updates user profile if expected.
            if (error === '' && options.profile === true) {
              odSession.setProfile({
                userName: options.data.emailId,
                companyId : data.companyId,
                businessUserId : data.businessUserId                   
              });
              odSession.save();
            }
         
            if (error) {
              angular.isFunction(callback) && callback(error, status);
            } else {
              angular.isFunction(callback) && callback(null,data);
            }
          });
      }
    },


    // Authenticates an user account.
    signIn: function(params,callback) {
      this._call({
        method: 'POST',
        url: '/business/user/login',
        profile: true,
        token: true,      
        data: {
          emailId: params.emailId,
          password: params.password
        },
      }, callback);
    },

    // Creates a new user account.
    signUp: function(params,callback) {
      this._call({
        method: 'POST',
        url: '/business/user',
        profile: true,
        token: true,    
        data: {
          businessUserId: 0,
          firstName: params.firstName,
          lastName: params.lastName,          
          phoneNumber: params.phoneNum,
          loginDto: {
            emailId: params.email,
            password: params.password   
            },
          isActive: 1,
          lastUpdationDate: '',
          companyName: params.company  
        },
      }, callback);
    },  

    // create a register company 

    register : function(params,callback) { 
      this._call({

        method : 'POST', 
        url : '/company/create', 
        token : true, 
        data : params
      }, callback);
    },
    
    publishSurvey: function(params, callback) {
      this._call({
        method : 'POST',
        url : '/questionnaire/create?userId=' + odSession.getProfile().businessUserId,   
        auth : true,  
        data : params,
        /*headers : {
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
          'Access-Control-Allow-Origin': '*',
           
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        }*/
      }, callback);
    },

    surveylist: function(callback) {
      var _url = '';
      if (odSession.isAuthenticated()) {
        _url = '/questionnaire/list/{companyId}?companyId=' + odSession.getProfile().companyId;
      }

      var self = this;
      this._call({
        method:'GET',
        url : _url,
        auth : true
      }, callback);
    },

    setSurveylist : function(list) {
      this._serverlist = list;
    },
    getSurveylist : function() {
      return this._serverlist; 
    },
    setSurveyid : function(id) {
      this._surveyid = id;
    },

    getSurveyid : function(id) {
      return this._surveyid;
    },
    questionlist : function(sid, callback) {
      var url = '';
      if (sid > 0) {
        url = '/questionnaire/search/' + sid;
      }

      this._call({
        method : 'GET',
        url : url,
        auth : true
      }, callback);

    },

    getQuestionlist : function() {
      return this._questionlist;
    },

    setQuestionlist : function(q) {
      this._questionlist = q;
    },

    setReport : function(data) {
      this._report = data;
    },

    getReport : function() {
      return this._report;
    },

    reportlist : function(sid, callback) {
      var url = '';
      if (sid > 0) {
        url = '/report/getreport?companyId=' + odSession.getProfile().companyId + '&userId=';
        url += odSession.getProfile().businessUserId + '&surveyId=';
        url += this._surveyid + '&startDate=';
        url += this._report.startDate + '&endDate=';
        url += this._report.endDate;
      }

      this._call({
        method : 'GET',
        url : url,
        auth : true
      }, callback);
    },

    setRoute : function(route) {
      this._currentRoute = route;
    },

    getRoute : function() {
      return this._currentRoute;
    },

    completeSurvey:function(params, callback) {
      params.customerId = 1;
      
      this._call({
        method : 'POST', 
        url : '/customer/survey/save',
        auth : true,
        data: params
      }, callback);
    }

  };
  
  });
