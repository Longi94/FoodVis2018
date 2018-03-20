function drawProductView(product){
	var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2,
		innerRadius = 0.3 * radius,
		product = product[0];

	var total = 0;
	selectedIngredients.forEach(ingredient => total += parseInt(product[ingredient]));
	
	let local_colors = colors;
	let local_selectedIngredients = selectedIngredients;
	if (total < 100) {
		product['other'] = 100 - total;
		local_selectedIngredients.push('other');
		local_colors['other'] = "transparent"
	}

	var max = 0;
	local_selectedIngredients.forEach(ingredient => max = Math.max(max, parseInt(product[ingredient]))); 	

	var pie = d3.pie()
		.sort(null)
		.value(function(d,i) { return Object.values(d)[0] });

	var arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(function (d,i) {
			let maxx = d.data[local_selectedIngredients[i]]/max > 1 ? 1 : d.data[local_selectedIngredients[i]]/max
			return (radius - innerRadius) * maxx + innerRadius;
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

    d3.select("#product_view").select("svg").remove();
    d3.select("#product_view").select("h2").remove();

	var svg = d3.select("#product_view").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	let _data = [];
	local_selectedIngredients.forEach(ingredient => {
		let x = {};
		x[ingredient] = +product[ingredient];
		_data.push(x);
	});

	_data.forEach((obj, i) => {
		Object.keys(obj).forEach(k => {
			if (obj[k] !== 0) return;
			console.log(k, obj[k]);
			delete local_colors[k];
			delete local_selectedIngredients[i];
		})	
	});

	console.log(_data);
	svg.selectAll(".solidArc")
		.data(pie(_data))
		.enter().append("path")
		.attr("fill", (d,i) => local_colors[local_selectedIngredients[i]])
		.attr("class", "solidArc")
		.attr("stroke", "gray")
		.attr("d", arc)
		.on("mouseover", (d,i) => {
            arcTooltip.style("opacity", .75);
            arcTooltip.html("<span>" + local_selectedIngredients[i] + "</span><span>" + d.data[local_selectedIngredients[i]]+ "g</span>");
        })
        .on("mouseout", () => {
            arcTooltip.style("opacity", 0);
        })


	svg.selectAll(".outlineArc")
		.data(pie(_data))
		.enter().append("path")
		.attr("fill", "none")
		.attr("stroke", "gray")
		.attr("class", "outlineArc")
		.attr("d", outlineArc);  
}