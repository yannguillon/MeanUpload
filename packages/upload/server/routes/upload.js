'use strict';

var uploads = require('../controllers/uploads');

// The Package is past automatically as first parameter
module.exports = function(Upload, app, auth, database) {

    app.route('/upload/create')
        .post(uploads.create);
    app.route('/uploads/:fileUrl')
        .post(uploads.show);

    app.get('/upload/example/render', function(req, res, next) {
        Upload.render('index', {
            package: 'upload'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
