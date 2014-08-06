'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/*Comments schema*/
var CommentSchema = new Schema({
	commOwner: {
	    type: Schema.ObjectId,
	    ref: 'User'
    },
	commbody: {
		type: String,
	    default: '',
	    trim: true,
	    //required: 'Comment cannot be blank'
	},
	updated: {
		type: Date,
	    default: Date.now
	}
});

/**
 * Likes Schema
 */
var LikeSchema = new Schema({
	user: {
		type: Schema.ObjectId,
	    ref: 'User'
	}
});


/**
 * Blog Schema
 */
var BlogSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
		//required: 'Content cannot be blank'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: [CommentSchema],
	likes: [LikeSchema]

});

mongoose.model('Blog', BlogSchema);