'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	blogs = require('../../app/controllers/blogs'),
	comms = require('../../app/controllers/comments');

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
	    .post(users.requiresLogin, comms.addComment);

	app.route('/comments/:commId')
	    .delete(users.requiresLogin, comms.hasAuthorization, comms.deleteComment);


	// Finish by binding the blog middleware
	app.param('blogId', blogs.blogByID);

	// Finish by binding the comment middleware
	app.param('commId', comms.commByID);
};