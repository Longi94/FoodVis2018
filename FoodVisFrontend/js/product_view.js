function drawProductView(product){
	var width = 500,
		height = 600,
		radius = Math.min(width, height) / 2,
		innerRadius = 0.3 * radius,
		product = product[0];

	let dwidth = $(document).width();
	let dheight = $(document).height();

	var total = 0;
	selectedIngredients.forEach(ingredient => {
		total += parseInt(product[ingredient] || 0)
	});
	//console.log("seleted ingredients")
	let local_colors = JSON.parse(JSON.stringify(colors));
	let local_selectedIngredients = JSON.parse(JSON.stringify(selectedIngredients));
	if (total < 100) {
		product['other'] = 100 - total;
		local_selectedIngredients.push('other');
		local_colors['other'] = "grey";
	}

	var max = 0;
	local_selectedIngredients.forEach(ingredient => max = Math.max(max, parseInt(product[ingredient] || 0))); 	

	var pie = d3.pie()
		.sort((d1, d2) => {return Object.values(d1)[0] - Object.values(d2)[0]})
		.value(function(d,i) { return Object.values(d)[0] });

	var arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(function (d,i) {
			let maxx = d.data[local_selectedIngredients[i]]/max > 1 ? 1 : d.data[local_selectedIngredients[i]]/max
			return (radius - innerRadius) * 1 + innerRadius;
		});

	var outlineArc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(radius);

	let arcTooltip = d3.select("body").append("div")
        .attr("class", "bar-tooltip")
        .style("opacity", "0");

    $(document).mousemove(event => {
        arcTooltip
            .style("left", event.pageX - 100 + "px")
            .style("top", event.pageY - 65 + "px");
    });

    d3.select("#product_view").append("h2").text(product.product_name);

    d3.select("#product_view").html(" ");//select("svg").remove();
    d3.select("#product_view").select("h2").remove();

    let legend = d3.select("#product_view")
    			   .append("svg")
    			   .attr("height",100)
    			   .attr("width",600)
    			   .attr("x",300)
    			   .attr("y",0);

    legend.append("text")
    	  .attr("text-anchor","middle")
    	  .attr("dominant-baseline","middle")
    	  .attr("font-size",35)
    	  .attr("font-weight","bold")
    	  .attr("x", 300)
    	  .attr("y",20)
    	  .text(product.product_name);

    /*legend.append("foreignObject")
    .attr("width",dwidth)
    .attr("height",100)
    .attr("x", 300)
    .attr("y", 20)
    .append("xhtml:h1")
    .style("font-size","35px")
    .style("font-weight","bold")
    .style("word-wrap","break-all")
    .style("text-align","center")
    .text(product.product_name);*/

	var svg = d3.select("#product_view").append("svg")
		.attr("width", dwidth)
		.attr("height", dheight);

	let g = svg.append("g")
		.attr("transform", "translate(" + dwidth / 2 + ",250)");

	let _data = [];
	local_selectedIngredients.forEach(ingredient => {
		let x = {};
		let ingredient_name = "";
		x[ingredient] = +product[ingredient];

		if(ingredient.indexOf("_") !== -1){
			ingredient_name = ingredient.split("_")[0];
		}else{
			ingredient_name = ingredient;
		}
		x["ingredient_name"] = ingredient_name;
		x["color"] = local_colors[ingredient];
		x["value"] = product[ingredient];
		_data.push(x);
	});
	console.log("pie(_data) ", pie(_data));
	console.log("_data ", _data);
	_data.forEach((obj, i) => {
		Object.keys(obj).forEach(k => {
			if (obj[k] !== 0) return;
			delete local_colors[k];
			delete local_selectedIngredients[i];
		})	
	});

	console.info(_data);
	let solidArcs = g.selectAll(".solidArc")
		.data(pie(_data))
		.enter().append("g");

	solidArcs.append("path")
		.attr("fill", (d,i) => local_colors[local_selectedIngredients[i]])
		.attr("class", "solidArc")
		.attr("stroke", "gray")
		.attr("d", arc)
		.attr("id", function(d){return d.data.ingredient_name;})
		.on("mouseover", (d,i) => {
            arcTooltip.style("opacity", .75);
            arcTooltip.html("<span>" + local_selectedIngredients[i] + "</span><span>" + d.data[local_selectedIngredients[i]]+ "g</span>");
        })
        .on("mouseout", () => {
            arcTooltip.style("opacity", 0);
        });

   let legendG =  legend.selectAll("g")
   				  .data(_data)
		    	  .enter()
		    	  .append("g");

   legendG.append("rect")
   .attr("x",function(d,i){return i*100;})
   .attr("y",35)
   .attr("width",100)
   .attr("height",60)
   .attr("fill", function(d){ return d.color;});

   legendG.append("text")
   		  .attr("x",function(d,i){
   		  	switch(i){
   		  		case 0: return 50; 
   		  		case 1: return 150; 
   		  		case 2: return 250;
   		  		case 3: return 350;
   		  		case 4: return 450;
   		  		case 5: return 550;
   		  	}
   		  })
   		  .attr("y",50)
   		  .attr("text-anchor","middle")
   		  .attr("dominant-baseline","middle")
   		  .attr("font-size",20)
   		  .attr("font-weight","bold")
   		  .attr("fill","white")
   		  .text(function(d){return d.ingredient_name});

   legendG.append("text")
   		  .attr("x",function(d,i){
   		  	switch(i){
   		  		case 0: return 50; 
   		  		case 1: return 150; 
   		  		case 2: return 250;
   		  		case 3: return 350;
   		  		case 4: return 450;
   		  		case 5: return 550;
   		  	}
   		  })
   		  .attr("y",80)
   		  .attr("text-anchor","middle")
   		  .attr("dominant-baseline","middle")
   		  .attr("font-size",20)
   		  .attr("font-weight","bold")
   		  .attr("fill","white")
   		  .text(function(d){return d.value+"g"})

/*solidArcs.append("text")
    		 .attr("x",5)
    		 .attr("dy",18)
    		 .append("textPath")
    		 .attr("xlink:href", function(d){ return "#"+d.data.ingredient_name;})
    		 .style("text-anchor","middle")
    		 .text(function(d){ return d.value; });*/

	

	g.selectAll(".outlineArc")
		.data(pie(_data))
		.enter().append("path")
		.attr("fill", "none")
		.attr("stroke", "gray")
		.attr("class", "outlineArc")
		.attr("d", outlineArc); 


	
}