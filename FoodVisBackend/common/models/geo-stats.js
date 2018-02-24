'use strict';
const request = require('request');

module.exports = function(Geostats) {

	Geostats.search = function(req, callback) {
		var queryObj = req.query;

		var productCode = queryObj.productCode;
		var countryCode = queryObj.countryCode;
		var year = queryObj.year;

		var requestUrl = `https://atlas.media.mit.edu/hs92/export/${year?year:'2016'}/${countryCode?countryCode:'all'}/show/${productCode}`;
		
		console.log('requestUrl: ' + requestUrl);
		var options = {
            method: 'GET',
            url: requestUrl
        };

        request(options, function (error, response, body) {
        	if (error) return callback(error);
        	var data = JSON.parse(body).data;

        	var totalImport = 0;
        	var totalExport = 0;

        	for(var i = 0; i < data.length; i++) {
        		var record = data[i];
        		if(record.import_val) totalImport += record.import_val;
        		if(record.export_val) totalExport += record.export_val;
        	}

        	for(var i = 0; i < data.length; i++) {
        		var record = data[i];
        		if(record.import_val) record.general_import_ptc = (record.import_val / totalImport) * 100;
        		if(record.export_val) record.general_export_ptc = (record.export_val / totalExport) * 100;
        	}

        	callback(null, data);

        });
	}


	Geostats.remoteMethod('search', {
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
