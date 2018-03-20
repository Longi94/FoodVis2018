var width = $(document).width();
var height  = $(document).height();
var nodes = [];

for(let i = 0; i < 10; i++){
 nodes.push({
 	r:50,
 	x: width * Math.random(),
    y: height * Math.random(),
    fill: "red"
 });
}

console.log(d3.select("#svg"));

var svg  = d3.select("#svg")
			 .append("svg")
			 .attr("width", width)
			 .attr("height",height);



var rect = svg.append("rect")
	.attr("width", width)
	.attr("height",height)
	.attr("fill", "grey");

var circles = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

  circles.enter()
    .append('circle')
    .attr('r', 50)
    .merge(circles)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

svg.append("text")
	.attr("x", width/2)
	 .attr("y", 100)
	 .attr("text-anchor", "middle")
	 .attr("alignment-baseline", "middle")
	 .attr("fill","white")
	 .attr("font-size","100px")
	 .attr("font-weight", "bold")
	 .text("TITLE");

var force = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-50))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collission', d3.forceCollide().radius(function(d){
  	return d.radius;
  }))
  .on('tick', ticked);

var inputBar = svg.append("foreignObject")
    .attr("width",width)
    .attr("height",50)
    .attr("x", 100)
    .attr("y", height/3)
    .append("xhtml:input")
    .style("width",(width-200)+"px")
    .style("z-index",1)
    .attr("placeholder","Search for category or product...");

var exampleDivs = svg.append("foreignObject")
					 .attr("width",width)
				     .attr("height",height)
					 .attr("x", 140)
					 .attr("y", height-(height/2)-50)
   					 .append("xhtml:div")
   					 .attr("class","container")
   					 .append("xhtml:div")
   					 .attr("class","row");

var col1 = exampleDivs.append("xhtml:div")
   			  .attr("class","col-sm-3")
   			  .style("background","red");

	  col1.append("xhtml:img")
	  .attr("src","images/productView.jpg")
	  .style("width","100%")
	  .style("height","auto");

	  col1.append("p").text("This is the description");


var col2 = exampleDivs.append("xhtml:div")
   			  .attr("class","col-sm-3")
   			  .style("background","yellow")
   			  .style("margin-left","10px")
	  		  .style("margin-right","10px");

   	  col2.append("xhtml:img")
	  .attr("src","images/stackedBarChart.jpg")
	  .style("width","100%")
	  .style("height","auto");
	  

	  col2.append("p").text("This is the description");

var col3 = exampleDivs.append("xhtml:div")
   			  .attr("class","col-sm-3")
   			  .style("background","green");

   	  col3.append("xhtml:img")
	  .attr("src","images/productView.jpg")
	  .style("width","100%")
	  .style("height","auto");

	  col3.append("p").text("This is the description");
force.start();
 function ticked(e) {
circles.attr("fill","red");
 circles.exit().remove();
 /*
  (function repeat() {
	      circles.transition().ease(d3.easeLinear).duration(1000)
	        .attr("cx", width/2 )
	        .attr("cy", height/2)
	      .transition().ease(d3.easeLinear).duration(5000)
	        .attr("cx", Math.floor((Math.random() * 600) + 60))
	        .attr("cy", Math.floor((Math.random() * 600) + 60))
	      .transition().ease(d3.easeLinear).duration(5000)
	        .attr("cx", Math.floor((Math.random() * 500) + (width-60)))
	        .attr("cx",Math.floor((Math.random() * 500) + (height-60)))
	      .transition().ease(d3.easeLinear).duration(5000)
	      	.attr("cx",Math.floor((Math.random() * 1000) + 400))
	      	.attr("cy",Math.floor((Math.random() * 500) + 200))
	      .transition().ease(d3.easeLinear).duration(5000)
	      	.attr("cx",Math.floor((Math.random() * 600) + (width-60)))
	      	.attr("cy",Math.floor((Math.random() * 600) + 60))
	      .transition().ease(d3.easeLinear).duration(5000)
	      	.attr("cx",Math.floor((Math.random() * 600) + 60))
	      	.attr("cy",Math.floor((Math.random() * 600) + (height-60)))
	      .on("end", repeat);
	})();
 */
}

function slide(d) {
	console.log("sliding");
	var circle = d3.select(this);
	(function repeat() {
	      circle = circle.transition().ease(d3.easeLinear).duration(1000)
	        .attr("cx", width/2 )
	        .attr("cy", height/2)
	      .transition().ease(d3.easeLinear).duration(5000)
	        .attr("cx", Math.floor((Math.random() * 600) + 60))
	        .attr("cy", Math.floor((Math.random() * 600) + 60))
	      .transition().ease(d3.easeLinear).duration(5000)
	        .attr("cx", Math.floor((Math.random() * 500) + (width-60)))
	        .attr("cx",Math.floor((Math.random() * 500) + (height-60)))
	      .transition().ease(d3.easeLinear).duration(5000)
	      	.attr("cx",Math.floor((Math.random() * 1000) + 400))
	      	.attr("cy",Math.floor((Math.random() * 500) + 200))
	      .transition().ease(d3.easeLinear).duration(5000)
	      	.attr("cx",Math.floor((Math.random() * 600) + (width-60)))
	      	.attr("cy",Math.floor((Math.random() * 600) + 60))
	      .transition().ease(d3.easeLinear).duration(5000)
	      	.attr("cx",Math.floor((Math.random() * 600) + 60))
	      	.attr("cy",Math.floor((Math.random() * 600) + (height-60)))
	      .on("end", repeat);
	})();
}

function dragstarted(d) {
  force.stop();
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  force.stop();
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  //force.restart();
  d3.select(this).classed("active", false);
}