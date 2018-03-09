


function setProductsBrowserData(products) {
	d3.selectAll(".categoryBox").remove();

	var test = ["aaa","bbb","ccc"];

	var uniqueCats = getCategories(products);
	var categoryMap = groupProductsByCategory(uniqueCats, products);

	Object.keys(categoryMap).forEach(function(key,inex) {
		d3.select('#products-browser_list')
			.append('div')
			.attr('id', key + '_box')
			.append('div')
			.attr('onclick','toggleCategory(this)')
			.attr('class','categoryBox')
			.attr('id', key)
			.append('p')
			.text(key.toUpperCase());

		d3.select('#' + key + '_box')
			.append('div')
			.attr('class','categoryBox_productContainer')
			.attr('id', key + '_container')
			.attr('hidden', true)
			.selectAll('.categoryBox_product')
	    	.data(categoryMap[key])
	    	.enter()
	    	.append('div')
	    	.attr('class','categoryBox_product')
	    	.append('p')
			.text(function(d) {
	            return d.product_name;
	        });
	});
}

function getCategories(products) {

	var uniqueCats = [];
	console.log('products.length: ' + products.length)
	for(var i = 0; i < products.length; i++) {
		var prd = products[i];
		var regexp = /en:([a-zA-Z0-9\-]*)/g;
		match = regexp.exec(prd.categories_tags);
		while (match != null) {
			var catName = match[1].toUpperCase();
		  if($.inArray(catName, uniqueCats) === -1) uniqueCats.push(catName);
		  match = regexp.exec(prd.categories_tags);
		}
	}

	return uniqueCats.sort();
}

function groupProductsByCategory(categories, products) {
	var result = {};
	for(var i = 0; i < categories.length; i++) {
		result[categories[i].toLowerCase()] = [];
	}
	for(var i = 0; i < products.length; i++) {
		var prd = products[i];
		for(var j = 0; j < categories.length; j++) {
			if(prd.categories_tags.includes(categories[j].toLowerCase())) {
				result[categories[j].toLowerCase()].push(prd);
			}
		}
	}
	console.log(result);
	return result;
}

function loadCategory(category) {
	console.log(category);
	$("#search-input").val(category.id.replace('-', ' '));
}

function toggleCategory(element) {
	$('#' + element.id + '_container').toggle();
	$('#' + element.id + '_box').toggleClass('categoryBox_selected');
}