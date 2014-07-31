// 'use strict';

// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
// 	Schema = mongoose.Schema;

// /**
//  * Likes Schema
//  */
// var LikeSchema = new Schema({
//     bgId: {
// 	    type: Schema.ObjectId,
// 	    ref: 'Blog'
//     },
// 	score : {
// 		type: Number,
// 	    default: 0
// 	},
// 	user: {
// 		type: Schema.ObjectId,
// 	    ref: 'User'
// 	}
// });

// mongoose.model('Like', LikeSchema);