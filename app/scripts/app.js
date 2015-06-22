'use strict';

/**
 * @ngdoc overview
 * @name odilinkApp
 * @description
 * # odilinkApp
 *
 * Main module of the application.
 */
angular
  .module('odilinkApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',    
    'ui.select',
    'ui.bootstrap',
    'ngDragDrop',
    'ui.sortable',
    'ui.bootstrap-slider',
    'xeditable',
    'timepickerPop',
    'ngJScrollPane',
    'autocomplete'
  ])
  .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        authenticated: true      
      })
      .when('/dashboard/create/:sid', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        authenticated: true      
      })
      .when('/dashboard/report/:sid', {
        templateUrl: 'views/report.html',
        controller: 'ReportCtrl',
        authenticated: true      
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl',
        anonymous:  true
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        anonymous:  true
      })
      .when('/signout', {
        template: '',
        controller: 'SignoutCtrl'
      })            
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        anonymous:  true
      })
      .when('/dashboard/reply/:sid', {
        templateUrl: 'views/reply.html',
        controller: 'ReplyCtrl',
        authenticated: true
      })
      .otherwise({
        redirectTo: '/signin'
      });
  })

  .run(function($rootScope, ODlink, Language, editableOptions) {
    $rootScope.lang = Language;    
    editableOptions.theme = 'bs3';
    $rootScope.$on('$routeChangeStart', function (event, next) {

      ODlink.api.setRoute(next.controller);
      $rootScope.$broadcast('DO_REFRESH_HEADER');
      if(next.authenticated && !ODlink.session.isAuthenticated()) {
          ODlink.session.path('/signin');
      }
      
      if (next.anonymous && ODlink.session.isAuthenticated()) {
        ODlink.session.path('/dashboard');        
      }

      });
});
