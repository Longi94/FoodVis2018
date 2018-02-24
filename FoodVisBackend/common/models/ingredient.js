'use strict';

var app = require('../../server/server.js');

module.exports = function(Ingredient) {

	Ingredient.search = function(req, callback) {
		var ProductsCollection = app.models.ProductsCollection;
		var queryObj = req.query;
		var ingredientName = queryObj.name;
		console.log('queryObj: ' + queryObj);
		console.log('ingredientName: ' + ingredientName);

		var whereObj = {};
		whereObj[ingredientName] = {gt: 0};

		console.log('whereObj: ' + whereObj);

		ProductsCollection.find({where:whereObj, order: ingredientName + ' DESC'}, function (err, data) {
		    if (err) {
		        return console.log(err);
		    } else {
		    	var response = [];
		    	for(var i = 0; i < data.length; i++) {
		    		var product = data[i];
		    		var productSlim = {};
		    		productSlim[ingredientName] = product[ingredientName];
		    		productSlim.id = product.id;
		    		productSlim.code = product.code;
		    		productSlim.product_name = product.product_name;
		    		productSlim.image_url = product.image_url;

		    		response.push(productSlim);
		    	}

		    	callback(null, response);
		    }
		});
	}


	Ingredient.remoteMethod('search', {
		accepts: [{
	        arg: 'req',
	        type: 'object',
	        required: true,
	        description: '',
	        http: {
	            source: 'req'
	        }
	    }],
	    returns: {type: 'array', root: true},
	    http: {verb: 'get'}
    });

};
