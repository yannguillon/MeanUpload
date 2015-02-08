'use strict';

angular.module('mean.upload').factory('Upload', [ '$resource',
    function($resource) {
        return $resource('upload/:fileUrl', {
            articleId: '@url'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);