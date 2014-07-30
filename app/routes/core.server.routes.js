'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core'),
	    blogs = require('../../app/controllers/blogs');
	app.route('/').get(core.index);
};