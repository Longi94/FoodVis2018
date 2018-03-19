function drawProductView(product){
	var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2,
		innerRadius = 0.3 * radius,
		product = product[0];

	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.width; });

	var total = 0;
	selectedIngredients.forEach(ingredient => total += parseInt(product[ingredient])); 	

	var arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(function (d,i) { 
			console.log((radius - innerRadius) * d.data[selectedIngredients[i]] + innerRadius);
			return (radius - innerRadius) * d.data[selectedIngredients[i]] + innerRadius; 
		});

	var outlineArc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(radius);

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

	var path = svg.selectAll(".solidArc")
		.data(pie(_data))
		.enter().append("path")
		.attr("fill", d => colors[d.key])
		.attr("class", "solidArc")
		.attr("stroke", "gray")
		.attr("d", arc)


	var outerPath = svg.selectAll(".outlineArc")
		.data(pie(_data))
		.enter().append("path")
		.attr("fill", "none")
		.attr("stroke", "gray")
		.attr("class", "outlineArc")
		.attr("d", outlineArc);  
}