


function setProductsBrowserData(products) {
	console.log(products);

	for(var i = 0; i < products.length; i++) {
		console.log(products[i].product_name + ' ' + products[i].image_url);
	}

	var ul = d3.select('#products-browser_list').append('ul');

	ul.selectAll('li')
		.data(products)
		.enter()
		.append('li')
		.append('text')
		.text(function(d) {
            return d.product_name;
        })
        .style('color', 'white');
}