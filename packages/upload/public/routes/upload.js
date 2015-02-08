'use strict';

angular.module('mean.upload').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('upload example page', {
            url: '/upload/',
            templateUrl: 'upload/views/index.html'
        });

        $stateProvider.state('create upload', {
            url: '/upload/create',
            templateUrl: 'upload/views/index.html'
        });

        $stateProvider.state('view upload', {
            url: '/upload/create',
            templateUrl: 'upload/views/index.html'
        });

        $stateProvider.state('file by id', {
            url: '/upload/:fileUrl',
            templateUrl: 'upload/views/view.html'
        });
    }
]);
