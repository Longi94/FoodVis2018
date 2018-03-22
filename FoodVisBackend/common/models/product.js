'use strict';

var app = require('../../server/server.js');

module.exports = function(Product) {


	Product.search = function(req, callback) {
		var ProductsCollection = app.models.ProductsCollection;
		var reqQueryObj = req.query;
		console.log('reqQueryObj:');
		console.log(reqQueryObj);

		// ---- WHERE ----

		var queryObj = {or:[]};
		if(reqQueryObj.product_name) {
			var pattern = new RegExp('.*'+reqQueryObj.product_name, "i");
			var product_name = {
				product_name: {
					like: pattern
				}
			};
			queryObj.or.push(product_name);
		}

		if(reqQueryObj.category) {
			var pattern = new RegExp('.*'+reqQueryObj.category+'.*', "i");
			var categories_tags = {
				categories_tags: {
					like: pattern
				}
			};
			queryObj.or.push(categories_tags);
		}

		if(reqQueryObj.ingredients) {
			var ingObj = JSON.parse(reqQueryObj.ingredients);
			console.log('------ ingerdients ------');
			console.log(ingObj);
			console.log('------ END ------');
			queryObj = Object.assign({}, queryObj, ingObj);
		}

		// ---- ORDER ----

		var order;
		if(reqQueryObj.order) {
			order = reqQueryObj.order;
		}

		// ---- OPTIONS ----

		var limit;
		if(reqQueryObj.limit) {
			limit = parseInt(reqQueryObj.limit);
		}

		var skip;
		if(reqQueryObj.skip) {
			skip = parseInt(reqQueryObj.skip);
		}

		// ---- FILTER OBJECT ----

		var filterObj = {
			where: queryObj,
			limit: limit,
			skip: skip,
			order: order
		};


		console.log('filterObj: ');
		console.log(filterObj.where);
		ProductsCollection.find(filterObj, function (err, data) {
		    if (err) {
		        return console.log(err);
		    } else {
				// console.log(data);
		    	callback(null, data);
		    }
		});
	}


	Product.remoteMethod('search', {
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
