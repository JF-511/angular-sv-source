'use strict';

/**
 * @ngdoc directive
 * @name odilinkApp.directive:arcChart
 * @description
 * # arcChart
 */
angular.module('odilinkApp')
  .directive('arcChart', function (ODlink) {
    return {
     
      restrict: 'EA',
      scope: {
      	bindModel:'=ngModel'
      },
      link: function postLink(scope, element, attrs) {
//
 //        d3Service.d3().then(function(d3) {
 			//var position = ODlink.session.position;

 			var position = scope.bindModel.answerOptionReportDtos.position;
 			var pscale = scope.bindModel.answerOptionReportDtos.scale;

	        var w = 320;
			var h = 320;
			var r = h/2;
			var colors = ["#8bc12d", "#e34546", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
			var wcolors = ["#ff0000", "#9467bd", "#2ca02c", "#d62728", "#ccaf0d", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
			//var color = d3.scale.category20c();
			var color = d3.scale.ordinal()
    		.range(colors);
			var data = [];
			var keyword = [];
			angular.forEach(scope.bindModel.answerOptionReportDtos, function(item, key) {
				var val = 0;
				var label = item.value;
				var percent = 0;
				

				percent = item.percentageResponseReceived;
				var key = item.answerOptionKeywordReportDtos;				
				if (typeof item.responseReceived === 'undefined') {
					val = 0;										
				}
				else {
					val = item.responseReceived;					
				}

				if (percent == undefined)
					percent = 0;

				if (key !== undefined) {
					keyword = keyword.concat(key);
				}

				data.push({'label' : label, 'value' : val, 'percent' : percent	});
			});
			
			data.sort(function(a, b) {
				if (a.value > b.value) {
					return 1;
				}
				else {
					return 0;
				}
			});

			var vis =  d3.select(element[0]).append('svg').data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
			var pie = d3.layout.pie().value(function(d){return d.value;});

			// declare an arc generator function
			var arc = d3.svg.arc().outerRadius(r);

			// select paths, use arc generator to draw
			var arcs = vis.selectAll("path").data(pie);//.attr("class", "slice");
			  arcs.enter()
		        .append('svg:path')		       
			.attr("fill", function(d, i){
			        return color(i);
			    })
			    .attr("d", function (d) {
			        // log the result of the arc generator to show how cool it is :)
			       // console.log(arc(d));
			        return arc(d);
			    }).attr({"stroke" : "#fff", "stroke-width" : "2"});

			// add the text
			var text = arcs.enter().append("svg:text").attr("transform", function(d){
						d.innerRadius = 0;
						d.outerRadius = r;
			    return "translate(" + arc.centroid(d) + ")";});

			text.append("svg:tspan").attr({ "text-anchor" : "middle", "class" : "label-percent" }).text(function(d, i) {
				return data[i].percent + "%";
			});

			text.append("svg:tspan").attr({"dy" : "1.0em","text-anchor" : "middle", "x" : "0px", 'class' : 'label-text'}).text( function(d, i) {
			    return data[i].label;}
					);

		//	});

			/*** word cloud ***/
			if (keyword.length > 0) {
				keyword.sort(function(a, b) {
					if (a.highFrequencyRank < b.highFrequencyRank) {
						return 1;
					}
					else {
						return 0;
					}
				});

				var words = [];
				/*angular.forEach(keyword, function(item, key) {
					words.push({
						text : item.value.toUpperCase(),
						size : 
					});
				});*/
				words = keyword.map(function(d, i) {
					var size = 80;
					if (d.highFrequencyRank <= 4) {
						size = 80 - (d.highFrequencyRank - 1) * 15;
					}
					else {
						size = (10 + d.highFrequencyRank * d.highFrequencyRank) / (d.highFrequencyRank * d.highFrequencyRank) * 45;
					}
					return {text : d.value.toUpperCase(), size: size, rotate : 0, xx: '', yy : '', rank :  d.highFrequencyRank}; //Math.random() * Math.PI * 20
				});
				var fill = d3.scale.ordinal().range(wcolors);
				  d3.layout.cloud().size([900, 400])
				      .words(words)
				      .padding(5)
				      .rotate(function() { return 0;  })
				      .font("Arial")				      
				      .fontSize(function(d) { return d.size; })
				      .on("end", draw)
				      .start();
     	}

     	/** summary **/
     	if (data.length > 0) {
     		jQuery(element[0]).append('<div class="summary"></div>');     	
     	var first = true;
     	var summary = jQuery(".summary");
     	angular.forEach(data, function(item, key) {
     		if (item.value > 0) {
     			var text = " of the customers answered " + item.label + ".";
     			
     			summary.append('<div class="row"><div class="pull-left"><div class="pic" style="background:' + colors[key % 10]+ '"></div></div><div class="pull-left text">' + item.percent + '% ' + text +'</div></div>');
     		}
     	});

     	
     	}

     	 	var  max,
    scale = 1,
    complete = 0,
    keyword = "",
    tags,
    fontSize,
    maxLength = 30,
    fetcher;
     
    

				        
function draw(data, bounds) {
	var w = 450;
     	 	var h = 200;
  scale = bounds ? Math.min(
      w / Math.abs(bounds[1].x - w / 2),
      w / Math.abs(bounds[0].x - w / 2),
      h / Math.abs(bounds[1].y - h / 2),
      h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;


  words = data;
  if (scale > 0.5) {
  	scale = 0.5;
  }

  if (pscale.length == 0) {
  	pscale.push(scale);
  }
  else {
  	scale = pscale[0];
  }
  var wcloud = d3.select(element[0]).append("svg")
					        .attr("width", w)
					        .attr("height", h);
	var background = wcloud.append("g");

  var wvis = wcloud.append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

  var text = wvis.selectAll("text")
      .data(words, function(d) { return d.text; });
  text.transition()
      .duration(1000)
      .attr("transform", function(d, i) { 
      	/*if (position.length == i) {
      		position.push({x : d.x, y : d.y});
      	} */ 
      	return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; 
      })
      .style("font-size", function(d) { return d.size + "px"; });
  text.enter().append("text")
      .attr("text-anchor", "middle")
      .attr("transform", function(d, i) {
      	
      	if (position.length == i) {
      		position.push({x : d.x, y : d.y});
      	}      	
       return "translate(" + [position[i].x, position[i].y] + ")rotate(" + d.rotate + ")"; })
      .style("font-size", "1px")
    .transition()
      .duration(1000)
      .style("font-size", function(d) { return d.size + "px"; });
  text.style("font-family", function(d) { return d.font; })
  	   .style("font-weight", function(d, i) { 
  	   	if (d.rank == 1) {
  	   		return "bold";
  	   }
  	   return "100";})
      .style("fill", function(d) { return fill(d.rank) })
      .text(function(d) { return d.text; });
  var exitGroup = background.append("g")
      .attr("transform", wvis.attr("transform"));
  var exitGroupNode = exitGroup.node();
  text.exit().each(function() {
    exitGroupNode.appendChild(this);
  });
  exitGroup.transition()
      .duration(1000)
      .style("opacity", 1e-6)
      .remove();
  wvis.transition()
  //    .delay(1000)
    //  .duration(750)
      .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}


/*
     	 function draw(data, bounds) {
     	 	var w = 450;
     	 	var h = 200;

     	 	var   scale = bounds ? Math.min(
      w / Math.abs(bounds[1].x - w / 2),
      w / Math.abs(bounds[0].x - w / 2),
      h / Math.abs(bounds[1].y - h / 2),
      h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
					    d3.select(element[0]).append("svg")
					        .attr("width", w)
					        .attr("height", h)
					      .append("g").attr("transform", "translate(" + [150, 60] + ")scale(" + scale + ")")
					       // .attr("transform", "translate(0,0)")
					      .selectAll("text")
					        .data(words)
					      .enter().append("text")
					        .style("font-size", function(d) { return d.size + "px"; })
					        .style("font-family", "Arial")
					        .style("font-weight", "700")
					        .style("fill", function(d, i) { return fill(i); })
					        .attr("text-anchor", "middle")
					        .attr("dx", function(d) {
					        	 var dx = d.x < 0 ? w  / 2 +  d.x  : d.x;
					         return dx;})
					        .attr("dy", function(d) { 
					        	var dy = d.y < 0 ? h / 2+ d.y  : d.y;
					        	return dy;})
					        .attr("transform", function(d) {
					          

					          /*var dx = d.x > 0 ? d.x : 500 - d.width - 10;
					          if ((dx + d.width) > 500 )
					          {
					          	dx = 500 - d.width - Math.random() * d.width;
					          }
					         var dx = d.x0 < 0 ? w +  d.x0  : d.x;
					         var dy = d.y0 < 0 ? h + d.y0  : d.y;
							  

					          console.log(d);
					          return "translate(" + [0, 0] + ")rotate(" + d.rotate + ")";
					        })
					        .text(function(d) { return d.text; });
					  }*/

    }
  };
});
