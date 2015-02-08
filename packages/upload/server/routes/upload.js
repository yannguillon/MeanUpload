'use strict';

var uploads = require('../controllers/uploads');

// The Package is past automatically as first parameter
module.exports = function(Upload, app, auth, database) {

    app.route('/upload/create')
        .post(uploads.create);
    app.route('/upload/:fileUrl')
        .get(uploads.show);

    app.get('/upload/', function(req, res, next) {
        Upload.render('index', {
            package: 'upload'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });

    app.param('fileUrl', uploads.file);

};
