'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	/*comments: [{
		commOwner: {
		    type: Schema.ObjectId,
		    ref: 'User'
	    },
		commbody: {
			type: String,
		    default: '',
		    trim: true
		},
		updated: {
			type: Date,
		     default: Date.now
		}

	}],*/
	likes: [{
		score : {
			type: Number,
		    default: 0
		},
		user: {
			type: Schema.ObjectId,
		    ref: 'User'
		}

	}]

});

mongoose.model('Blog', BlogSchema);