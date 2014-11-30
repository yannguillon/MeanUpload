'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    _ = require('lodash');
//    fs = require('fs');


///**
// * Find article by id
// */
//exports.article = function(req, res, next, id) {
//    Article.load(id, function(err, article) {
//        if (err) return next(err);
//        if (!article) return next(new Error('Failed to load article ' + id));
//        req.article = article;
//        next();
//    });
//};

/**
 * Create an article
 */
exports.create = function(req, res) {
    var file = new File();
    var _files = [];

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var _file = new File();
        _file.name = filename;
        _file.path = '/lol';
        _file.user = req.user;
        _file.type = mimetype;
        _file.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot save the file'
                });
            }
            res.json(file);
        });
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.json(req.file);
};


/**
 * Update an article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the article'
            });
        }
        res.json(article);

    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the article'
            });
        }
        res.json(article);

    });
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
//    Article.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
//        if (err) {
//            return res.status(500).json({
//                error: 'Cannot list the articles'
//            });
//        }
//        res.json(articles);
//
//    });
};
