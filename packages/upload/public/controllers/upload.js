'use strict';

angular.module('mean.upload', ['angularFileUpload']).controller('UploadController', ['$scope', '$stateParams', 'Global', 'Upload', 'FileUploader',
    function($scope, $stateParams, Global, Upload, FileUploader) {
        var displayEnum = {
            IMAGE : 0,
            VIDEO : 1,
            AUDIO : 2
        };

        $scope.global = Global;
        $scope.package = {
            name: 'upload'
        };

        var uploader = $scope.uploader = new FileUploader({
            url: '/upload/create'
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        $scope.getUser = function(file){
            return file.user ? file.user.username[0].toUpperCase() + file.user.username.slice(1) : "Anonymous";
        };

        $scope.findOne = function() {
            Upload.get({
                fileUrl: $stateParams.fileUrl
            }, function(file) {
                if(file.type.indexOf("image") > -1) {
                    file.displayType = displayEnum.IMAGE;
                } else {
                    file.displayType = null;
                }
                $scope.displayEnum = displayEnum;
                $scope.file = file;
            });
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.log(response);
            fileItem.generatedURL = response.url;
        };

// CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };

        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem');
        };

    }
]);