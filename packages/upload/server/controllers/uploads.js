'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    _ = require('lodash'),
    aws_s3_bucket_name = 'nodeupload',
    aws_region = 'eu-central-1',
    aws_block_size = 1024*1024*5, // 5mb per part
    UPLOAD_FOLDER = 'uploads',
    AWS = require('aws-sdk');

/**
 * Create an article
 */

exports.file = function(req, res, next, url) {
    File.load(url, function(err, file) {
        if (err) return next(err);
        if (!file) return next(new Error('Failed to load file ' + url));
        req.file = file;
        next();
    });
};

exports.create = function(req, res) {
    AWS.config.region = aws_region;
    var s3 = new AWS.S3({params: {Bucket: aws_s3_bucket_name}});
    req.files = {};
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var uploadId = null;
        var key = UPLOAD_FOLDER + "/" + new Date().getTime() + "/" + filename;
        s3.createMultipartUpload({Key: key}, function(mpErr, multipart) {
            var buffer = [];
            var multipartMap = {
                Parts: []
            };
            var totalPartNumber = 1;
            var parts = 1;
            if (mpErr) {
                console.log('Error!', mpErr);
                return;
            }
            uploadId = multipart.UploadId;

            file.on('data', function(chunk) {
                buffer.push(chunk);
                if (Buffer.concat(buffer).length < aws_block_size) {
                    return ;
                }
                uploadPart(Buffer.concat(buffer), totalPartNumber, uploadId);
                totalPartNumber += 1;
                buffer = [];
            });

            file.on('end', function() {
                uploadPart(Buffer.concat(buffer), totalPartNumber, uploadId);
            });

            var uploadPart = function(buffer, partNumber, uploadId){
                s3.uploadPart({Body: buffer, Key:key, PartNumber: String(partNumber), UploadId: uploadId}, function(multiErr, mData) {
                    console.log('part number done  :' + this.request.params.PartNumber);
                    if (multiErr){
                        console.log('multiErr, upload part error:', multiErr);
                        return;
                    }
                    multipartMap.Parts[this.request.params.PartNumber - 1] = {
                        ETag: mData.ETag,
                        PartNumber: Number(this.request.params.PartNumber)
                    };
                    if (parts === totalPartNumber) {
                        s3.completeMultipartUpload({ Key: key, MultipartUpload: multipartMap, UploadId: uploadId }, function(err, data) {
                            if (err) {
                                console.log('An error occurred while completing the multipart upload');
                                console.log(err);
                            } else {
                                var _file = new File();
                                _file.name = filename;
                                _file.path = data.Location;
                                _file.user = req.user;
                                _file.type = mimetype;
                                _file.key = key;
                                _file.save(function(err) {
                                    if (err) {
                                        return res.status(500).json({
                                            error: 'Cannot save the file'
                                        });
                                    }
                                    res.json(_file);
                                });
                            }
                        });
                    }
                    parts += 1;
                });
            };
                //var finalBuffer = Buffer.concat(this.fileRead);
                //req.files[fieldname] = {
                //    buffer: finalBuffer,
                //    size: finalBuffer.length,
                //    filename: filename,
                //    mimetype: mimetype
                //};
        });

        //file.fileRead = [];
        //file.contentSize = 0;

        //
        //file.on('error', function(err) {
        //    console.log('Error while buffering the stream: ', err);
        //});
        //
        //file.on('end', function() {
        //    var finalBuffer = Buffer.concat(this.fileRead);
        //    req.files[fieldname] = {
        //        buffer: finalBuffer,
        //        size: finalBuffer.length,
        //        filename: filename,
        //        mimetype: mimetype
        //    };
        //
        //    var headers = {
        //        'Content-Length': req.files[fieldname].size,
        //        'Content-Type': req.files[fieldname].mimetype,
        //        'x-amz-acl': 'public-read'
        //    };
        //
        //    s3bucket.createBucket(function() {
        //        var params = {Key: 'uploads/'+filename, Body: req.files[fieldname].buffer};
        //        s3bucket.upload(params, function(err, data) {
        //            if (err) {
        //                console.log("Error uploading data: ", err);
        //            } else {
        //                var _file = new File();
        //                _file.name = filename;
        //                _file.path = data.Location;
        //                _file.tag = data.ETag;
        //                _file.user = req.user;
        //                _file.type = mimetype;
        //                _file.size = humanize.filesize(finalBuffer.length);
        //                _file.save(function(err) {
        //                    if (err) {
        //                        return res.status(500).json({
        //                            error: 'Cannot save the file'
        //                        });
        //                    }
        //                    res.json(_file);
        //                });
        //            }
        //        });
           });
        //});
    //});

    req.pipe(req.busboy);
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    AWS.config.region = aws_region;
    var s3 = new AWS.S3({params: {Bucket: aws_s3_bucket_name}});
    var file = req.file;
    var params = {Bucket: aws_s3_bucket_name, Key: file.key, Expires: 600};
    console.log(file);
    file.path
    s3.getSignedUrl('getObject', params, function (err, url) {
        console.log('The URL is', url);
    });
    res.json(file);
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
