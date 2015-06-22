'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:contenteditable
 * @description
 * # contenteditable
 */
angular.module('odilinkApp')
  .directive('contenteditable', function ($filter) {
   return {
          restrict: 'A', // only activate on element attribute
          require: '?ngModel', // get a hold of NgModelController
          scope: {
            callback: '&onChange',
            options : '=?'
          },
          link: function(scope, element, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model
            var ans = attrs.answers;

            var placeholder = attrs.placeholder;
            var on = attrs.on == undefined ? false : true;
            // Specify how UI should be updated
            ngModel.$render = function renderFn() {              
              element.html(ngModel.$viewValue || placeholder);    
              if (ngModel.$viewValue == '') {
                setTimeout(function() {
                          jQuery(element[0]).focus();
                        }, 400);
              } 
                     
            };

            // Listen for change events to enable binding
            element.on('keyup change', function onListen() {
              scope.$apply(read);             
            });


            element.on('focus', function() {
//console.log(jQuery(element).attr("placeholder"));
              var val = element.text() || '';
              if (val == placeholder || val == '') {
                element.html('');                               
              }
              

              scope.$apply(read);
              if (on)
              		jQuery(element).parent().removeClass("notice");
            });

            element.on('blur', function() {              
              var val = ngModel.$viewValue || element.text() || '';
              val = val.trim().toLowerCase();
              

              var q =jQuery(element).closest(".editquestion"); 
              if (q.length > 0) {
                var me = jQuery(element)[0];
                if (val != '') {
                  if (jQuery(q).find(".label-alert").length > 0)
                    jQuery(q).find(".label-alert").remove();

                  jQuery(q.parent()).find("[contenteditable]").each(function(idx, obj) {
                    
                    if (me != jQuery(obj)[0]) {
                      var text = jQuery(obj).text().trim().toLowerCase();
                      if (val == text) {
                        jQuery(element).parent().parent().after("<div class='label-alert'>Label already exists</div>");
                        
                        setTimeout(function() {
                          jQuery(element[0]).focus();
                        }, 400);
                      }
                    }
                  });

                 /* if (jQuery(q).find('.label-alert').length == 0) {
                     scope.options = $filter('orderBy')(scope.options, 'value');
                  }*/
                }
                else {
                  console.log(jQuery(element).attr("placeholder") + "test");
                  if (jQuery(q).find(".label-alert").length > 0)
                    jQuery(q).find(".label-alert").remove();

                  jQuery(element).parent().parent().after("<div class='label-alert'>Label is empty</div>");                

                  setTimeout(function() {
                      jQuery(element[0]).focus();
                  }, 400);
                }

              }


              scope.$apply(read);  
              if (val == '' || val == '&nbsp;' ) {                
                element.html(placeholder);
                if (on)
                 jQuery(element).parent().addClass("notice");
              }            
            });

            
            element.on('keydown', function onEnter(e){
                if(attrs.noEnter && e.keyCode == 13)
                {
                    return false;
                }
            });

            element.on('click' , function onClick(){
            	setTimeout(function(){
			        jQuery(element[0]).focus();
			     }, 10);               
            });
            //ngModel.$render(); // initialize
            var text = element.text();
            if (text == placeholder) {
            	if (on)
            		jQuery(element).parent().addClass("notice");
            	//scope.$apply();
            }
            // Write data to the model
           // String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

            function read() {
              var html = element.text().trim();
              // When we clear the content editable the browser leaves a <br> behind
              // If strip-br attribute is provided then we strip this out
              if( attrs.stripBr && html == '<br>' ) {                
                html = typeof placeholder === 'undefined' ? '' : placeholder;
              }             

              ngModel.$setViewValue(html);
            }
          }
        };
  });
