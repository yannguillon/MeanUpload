'use strict';

var shortId = require('shortid');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },

    path: {
        type: String,
        required: true,
        trim: true
    },
    tag: {
        type: String,
        required: false,
        trim: true
    },

    url: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        'default': shortId.generate
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    type: {
        type: String,
        required: false,
        trim: true
    },

    size: {
        type: String,
        required: false,
        trim: true
    },

    key: {
        type: String
    }
});
//
///**
// * Validations
// */
//ArticleSchema.path('title').validate(function(title) {
//    return !!title;
//}, 'Title cannot be blank');
//
//ArticleSchema.path('content').validate(function(content) {
//    return !!content;
//}, 'Content cannot be blank');

/**
 * Statics
 */

FileSchema.statics.load = function(url, cb) {
    this.findOne({
        url: url
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('File', FileSchema);
