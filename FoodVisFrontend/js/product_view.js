function drawProductView(product){
	var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2,
		innerRadius = 0.3 * radius,
		product = product[0];

	var pie = d3.pie()
		.sort(null)
		.value(function(d,i) { return .5 });

	var max = 0;
	selectedIngredients.forEach(ingredient => max = Math.max(max, parseInt(product[ingredient]))); 	

	var arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(function (d,i) {
			let maxx = d.data[selectedIngredients[i]]/max > 1 ? 1 : d.data[selectedIngredients[i]]/max
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

	var svg = d3.select("#product_view").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	let _data = [];
	selectedIngredients.forEach(ingredient => {
		let x = {};
		x[ingredient] = product[ingredient];
		_data.push(x);
	});

	svg.selectAll(".solidArc")
		.data(pie(_data))
		.enter().append("path")
		.attr("fill", (d,i) => colors[selectedIngredients[i]])
		.attr("class", "solidArc")
		.attr("stroke", "gray")
		.attr("d", arc)
		.on("mouseover", (d,i) => {
            arcTooltip.style("opacity", .75);
            arcTooltip.html("<span>" + selectedIngredients[i] + "</span><span>" + d.data[selectedIngredients[i]]+ "</span>");
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