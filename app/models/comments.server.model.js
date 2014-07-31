// 'use strict';

// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
// 	Schema = mongoose.Schema;

// /**
//  * Blog Schema
//  */
// var CommentSchema = new Schema({
// 	blogId: {
// 	    type: Schema.ObjectId,
// 	    ref: 'Blog'
//     },
// 	commOwner: {
// 	    type: Schema.ObjectId,
// 	    ref: 'User'
//     },
// 	commbody: {
// 		type: String,
// 	    default: '',
// 	    trim: true
// 	},
// 	updated: {
// 		type: Date,
// 	     default: Date.now
// 	}
// });

// mongoose.model('Comment', CommentSchema);