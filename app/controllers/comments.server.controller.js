'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	BLog = mongoose.model('Blog'),
	_ = require('lodash');
var blogs = require('../../app/controllers/blogs');

/**
 * Add a comment
 */
exports.addComment = function(req, res) {
	var blog = req.blog;
	var comment = req.body;
	comment.commOwner = req.user;
	blog.comments.unshift(comment);

	blog.save(function(err) {
		if (err) {
			return res.send(400, {
				message: blogs.getErrorMessage(err)
			});
		} 	
		else {
			res.jsonp(blog);
		}
	});
};

 
 /**
 * Delete a comment
 */
exports.deleteComment = function(req, res) {
    var blog = req.blog;

    blog.comments.id(req.params.commId).remove();
    blog.save(function(err){
    	if(err) {
    		return res.send(400, {
    			message: 'comment delete failed'
    		});
    	}
    	else{
    		res.jsonp(blog);
    	}

    });

};

/**
 * Comment middleware
 */
exports.commByID = function(req, res, next, id) {
	req.comment = req.blog.comments.id(id);
	next();
};

/**
 * comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comment.commOwner._id.toString() !== req.user.id) {
		return res.send(403, {
			commMessage: 'User is not authorized'
		});
	}
	next();
};
