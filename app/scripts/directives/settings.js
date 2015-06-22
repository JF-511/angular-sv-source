'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:settings
 * @description
 * # settings
 */
angular.module('odilinkApp')
  .directive('settings', function (localstorage) {
    return {
            restrict: 'E',
            replace: true,
            templateUrl: 'tpl/directive/settings.html',
            scope: true,
            link: function (scope, element, attributes) {
                element.parent().css({
                    position: 'relative'
                });

                element.on('click', '#settings', function () {
                    element.toggleClass('activate');
                })
            },
            controller: function ($scope) {

                var $root = jQuery('body');

                $scope.skins = [
                    {
                        value : 'classic'
                    },
	            	{
	            		value : 'ultra'
	            	}, 	            	
                    {
                        value : 'original'
                    },
                    {
                        value : 'originalpro'
                    }
            	];

                $scope.$watch('skin', function (skin) {                	
                    $root.addClass(skin.value);                    
                });

                $scope.skin = localstorage.getObject('theme') || $scope.skins[1];            	

                $scope.setSkin = function ($item, $skin) {
                	$root.removeClass($scope.skin.value);
                	$scope.skin = $item;  
                	localstorage.setObject('theme', $item);                	
                };

            }
        }    
  });
