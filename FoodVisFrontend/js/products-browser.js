
uniqueCats = [];
categoryMap = {};
productList = [];
selectedProducts = [];

function setProductsBrowserData(products) {
	d3.select('#products-browser_list').selectAll("*").remove();
	productList = products;
	uniqueCats = getCategories(products);
	categoryMap = groupProductsByCategory(uniqueCats, productList);

	Object.keys(categoryMap).forEach(function(key,index) {
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
	    	.data(categoryMap[key].products)
	    	.enter()
	    	.append('div')
	    	.attr('class','categoryBox_product')
	    	.attr('id', function(d) {
	    		return 'cat'+key+'prd'+d.id
	    	})
	    	.attr('product_id', function(d) {
	            return d.id;
	        })
	    	.append('p')
			.text(function(d) {
	            return d.product_name;
	        });


	});

	d3.selectAll('.categoryBox_product')
	    	.append('button')
	    	.text('Add/Remove')
	    	.attr('onclick','toggleProductSelection(this.parentNode.attributes.product_id.nodeValue)');
}

function refreshData() {
	var highestCount = 0;
	Object.keys(categoryMap).forEach(function(key,index) {
		if(categoryMap[key].selectedCount > highestCount) {
			highestCount = categoryMap[key].selectedCount;
		}
	});
	var colorScale = d3.scaleLinear().domain([0,highestCount]).range([0,200]);


	Object.keys(categoryMap).forEach(function(key,index) {

		var category = categoryMap[key];
		d3.select('#'+key)
			.select('p')
			.text(() => {
				if(category.selectedCount > 0) return key.toUpperCase() + ' ( ' + category.selectedCount + ' )';
				else return key.toUpperCase();
			});

		d3.select('#'+key)
			.transition()
				.duration(500)
				.style("background-color", () => {
					if(category.selectedCount > 0) return 'rgba(125,'+colorScale(category.selectedCount)+',54,0.35)';
					else return 'rgb(44, 44, 49)';
				});

		for(p in productList) {
			var prd = productList[p];
			d3.select('#cat'+key+'prd'+prd.id)
				.select('p')
				.text(() => {
					if(prd.selected === true) return prd.product_name + ' [ ADDED ]';
					else return prd.product_name;
				});
		}

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
		result[categories[i].toLowerCase()] = {
			selectedCount: 0,
			products: []
		};
	}
	for(var i = 0; i < products.length; i++) {
		var prd = products[i];

		for(var j = 0; j < categories.length; j++) {
			if(prd.categories_tags.includes(categories[j].toLowerCase())) {
				result[categories[j].toLowerCase()].products.push(prd);
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
	console.log(element);
	$('#' + element.id + '_container').toggle();
	$('#' + element.id + '_box').toggleClass('categoryBox_selected');
}

function toggleProductSelection(productId) {
	console.log(productId);
	for(prd in productList) {
		var product = productList[prd];
		if(product.id === productId) {
			if(!product.selected) { 
				product.selected = true;
				if(selectedProducts.indexOf(product) === -1) {
			        selectedProducts.push(product);
				}
			}
			else {
				selectedProducts = selectedProducts.filter(function(x){ return x.id !== productId});
				product.selected = false;
			}
		}
	}

	Object.keys(categoryMap).forEach(function(key,index) {
		var category = categoryMap[key];
		for(prd in category.products) {
			var product = category.products[prd];
			if(product.id === productId) {
				if(product.selected) category.selectedCount++;
				else category.selectedCount--;
			}
		}
	});

	refreshData();
	setBarChartData(selectedProducts);
    setHeatmapData(selectedProducts);

	console.log('selectedProducts:');
	console.log(selectedProducts);

	console.log(categoryMap);
}