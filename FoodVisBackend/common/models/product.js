'use strict';

var app = require('../../server/server.js');

module.exports = function(Product) {


	Product.search = function(req, callback) {
		var ProductsCollection = app.models.ProductsCollection;
		var queryObj = req.query;
		console.log(queryObj);
		ProductsCollection.find({where:queryObj}, function (err, data) {
		    if (err) {
		        return console.log(err);
		    } else {
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
	    returns: {type: 'array', root: true}
    });

};
