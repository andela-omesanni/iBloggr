'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Comment = mongoose.model('Comment'),
	_ = require('lodash');
var blogs = require('../../app/controllers/blogs');

/**
 * Add a comment
 */
exports.addComment = function(req, res) {
       var comment = new Comment(req.body);
	   comment.commentOwner = req.user;

	   comment.save(function(err) {
		if (err) {
			return res.send(400, {
				message: blogs.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	   });
};

 
 /**
 * Delete a comment
 */
exports.deleteComment = function(req, res) {
    var comment = req.comment;

	comment.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: blogs.getErrorMessage(err)
			});
		} else {
               res.jsonp(comment);
		}
	});
};

/**
 * Comment middleware
 */
exports.commByID = function(req, res, next, id) {
	Comment.findById(id).exec(function(err, comm) {
		if (err) return next(err);
		if (!comm) return next(new Error('Failed to load blog ' + id));
        req.comment = comm;
		next();
		
	});
};

/**
 * comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comment.commOwner !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
