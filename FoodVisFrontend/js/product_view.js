var r2 = 50;

var createIngredientNodes = function(ingredients){
 let nodes = [];
 let width = 500;
 let height = 500;
 let angle;
 let x;
 let y;
 let ingredientsLength = ingredients.length;

 for(let i = 0; i < ingredientsLength; i++){
 	 angle = (i/ (ingredientsLength/2)) * Math.PI;
 	 x = (200 * Math.cos(angle)) + (width/2);
	 y = (200 * Math.sin(angle)) + (width/2); 
	 nodes.push({'x': x, 'y': y, 'val': ingredients[i].val, 'name': ingredients[i].name, 'r':r2, 'angle':angle, 'color':ingredients[i].color});
 }
 return nodes;
}

var draw = function(ingredientsData, productName){
	//d3.select("#")
	let width = 550;
	let height = 600;
	let nodesWidth = 250;
	let nodesHeight = 250;
	let cx = width/2;
	let cy = height/2;
	let nodes = createIngredientNodes(ingredientsData)
	let r1 = 90;

	let svg = d3.select("#product_view")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")


	let ingredientNodes = svg.selectAll("g")
		.remove()
		.exit()
        .data(nodes);

    let ingredientNodesCanvas = ingredientNodes.enter()
	    .append("g");

	let productNode = svg.append("g")
							.attr("x",nodesWidth)
							.attr("y",nodesHeight);


 	productNode.append("circle")
			     .attr("id", "main-circle")
			     .attr("r", r1)
			     .attr("cx", nodesWidth)
			     .attr("cy",nodesHeight)
			     .attr("fill", "#3FB8AF")
			     .attr("stroke", "black")
			     .attr("stroke-width",1)
			     .attr("opacity",0.3)   
			     .attr("pointer-events","all")
			     //.on("mouseenter", handleMouseOver)
			     .on("mouseover", handleMouseOver)
			     .on("mouseout", handleMouseOut);
			     //.on("mouseleave", handleMouseOut);

    productNode.append("text")
   				 .attr("x", nodesWidth)
   				 .attr("y", nodesHeight)
   				 .attr("text-anchor", "middle")
   				 .attr("alignment-baseline", "middle")
   				 .attr("fill","white")
   				 .attr("font-size","30px")
   				 .attr("font-weight", "bold")
   				 .text(productName);


	ingredientNodesCanvas.append("circle")
			.attr("r", function(d){return d.r})
			.attr("cx", function(d,i){
				return d.x;
			})
			.attr("cy", function(d,i){
				return d.y;
			})
			.attr("fill", function(d){return d.color})//"url('#grad')")
			.attr("stroke","black")
			.attr("stroke-width",1);

	svg.selectAll('line2')
	  .remove()
	  .exit()
      .data(nodes)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', function(d) {return (d.x - d.r * Math.cos(d.angle)); })
      .attr('y1', function(d) { return (d.y - d.r * Math.sin(d.angle)) })
      .attr('x2', function(d){return (d.x + nodesWidth)/2})
      .attr('y2', function(d){return (d.y+nodesHeight)/2})
	  .attr("stroke","red")
      .attr("stroke-width", 2)
      .attr("fill","none");

	ingredientNodesCanvas.append("line")
			.attr("stroke", "white")
			.attr("stroke-width",2)
			.attr("x1", function(d){return d.x+d.r;})
			.attr("y1", function(d){return d.y;})
			.attr("x2", function(d){return d.x-d.r;})
			.attr("y2",function(d){return d.y;});
			
						
	ingredientNodesCanvas.append("text")
			 .attr("text-anchor","middle")
			 .attr("alignment-baseline", "middle")
			 .attr("dx", function(d){return d.x})
			 .attr("dy", function(d){return d.y+(r2/2)})
			 .attr("fill","white")
			 .text(function(d) {return d.val});

	ingredientNodesCanvas.append("text")
			 .attr("text-anchor", "middle")
			 .attr("alignment-baseline", "middle")
			 .attr("dx",function(d){return d.x})
			 .attr("dy", function(d){return d.y-10})
			 .attr("fill","white")
			 .text(function(d){return d.name});								
  }
 

d3.json("example.json", function(error, data) {
    let ingredientsData = [];

    ingredientsData.push({name:"Fat", val:data[0].fat_100g, color:"#ECD078"});
    ingredientsData.push({name:"Carbs", val:data[0].carbohydrates_100g, color:"#D95B43"});
    ingredientsData.push({name:"Sugars",val:data[0].sugars_100g, color:"#C02942"});
    ingredientsData.push({name:"Protein",val:data[0].proteins_100g,color:"#425b94"});
    ingredientsData.push({name:"Salt", val:data[0].salt_100g,color:"#45965b"});

    draw(ingredientsData, data[0].product_name);
});

function handleMouseOver(d, i) { 
	d3.select(this).attr({
	 opacity:1
	});
	console.log("helloooo");
}

function handleMouseOut(d,i){
	d3.select(this).attr({
		opacity:0.5
	});

}
