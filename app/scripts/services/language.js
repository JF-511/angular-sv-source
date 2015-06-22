'use strict';

/**
 * @ngdoc service
 * @name odilinkApp.Language
 * @description
 * # Language
 * Constant in the odilinkApp.
 */
angular.module('odilinkApp')
  .constant('Language', {
  	'signup' : {
  		'name' : {
  			'first' : 'First',
  			'error' : 'Please input Full name.',
  			'error2' : 'Please input Last Name',
  			'last'  : 'Last Name',  			
  		},
  		'email' : {
  			'title' : 'Email',
  			'error' : 'Please input correct email.',  						
  		},
  		'username' : {
  			'title' : 'username',
  			'error' : 'Please input correct username',
  		},

  		'password' : {
  			'title' : 'Password',
  			'confirm' : 'Confirm Password',
  			'error'  : 'Password is not matched.',
  			'require' : 'Please input password'
  		},
  		'company' : {
  			'title' : 'Company',
  			'require' : 'Please input company'
  		},
  		'phone' : {
  			'title' : 'Phone Number',
  			'error' : 'Please input phone number.'
  		}
  	},
    'signin': {
      'email' : {
        'title': 'Email',
        'error' : 'Please input correct email.'
      },
      'password' : {
        'title': 'password',
        'error' : 'Please input password'
      },

    }
  });
