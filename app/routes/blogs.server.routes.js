'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	blogs = require('../../app/controllers/blogs');

module.exports = function(app) {
	// Article Routes
	app.route('/blogs')
		.get(blogs.list)
		.post(users.requiresLogin, blogs.create);

	app.route('/blogs/:blogId')
		.get(blogs.read)
		.put(users.requiresLogin, blogs.hasAuthorization, blogs.update)
		.delete(users.requiresLogin, blogs.hasAuthorization, blogs.delete);

	app.route('/comments')
	    .post(users.requiresLogin, blogs.addComment);

	app.route('/comments/:commId')
	    .delete(users.requiresLogin, blogs.hasAuthorization, blogs.deleteComment);


	// Finish by binding the article middleware
	app.param('blogId', blogs.blogByID);
};