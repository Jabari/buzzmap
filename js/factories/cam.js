angular.module('buzzmap.services', ['ngResource'])

  .factory('Photo', function($q, $cordovaCamera, ApiUrl) {
    return {
      takePicture: function(ngNotify) {
        var q = $q.defer();
        if (typeof Camera === 'undefined') {
          var error = 'Camera is not available';
          console.log(error);
          ngNotify.set(error, {type: 'error'});
          q.reject(error);
        } else {
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA
          };
          $cordovaCamera.getPicture(options).then(
            function(imageData) {
              q.resolve(imageData);
            },
            function(error) {
              console.log("Failed to take photo: " + JSON.stringify(error));
              q.reject(error);
            });
        }
        return q.promise;
      },
      selectPicture: function(ngNotify) {
        var q = $q.defer();
        if (typeof Camera === 'undefined') {
          var error = 'Camera is not available';
          console.log(error);
          ngNotify.set(error, {type: 'error'});
          q.reject(error);
        } else {
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          };
          $cordovaCamera.getPicture(options).then(
            function(imageData) {
              q.resolve(imageData);
            },
            function(error) {
              console.log("Failed to get photo from library: " + JSON.stringify(error));
              q.reject(error);
            });
        }
        return q.promise;
      },
      uploadPicture: function(ngNotify, violationId, imageData) {
        var q = $q.defer();

        var options = new FileUploadOptions();
        options.fileKey = "image";
        options.fileName = "report.jpg";
        options.mimeType = "image/jpeg";
        options.chunkedMode = false; // Absolutely required for https uploads!
        options.params = {};
        options.params.violation_id = violationId;

        var ft = new FileTransfer();
        ft.upload(imageData, encodeURI(ApiUrl.get() + '/photos.json'),
          function(response) {
            console.log("Done uploading file");
            q.resolve(response);
          },
          function(error) {
            ngNotify.set('Unable to upload your photo at this time.', {type: 'error'});
            for (var key in error) {
              console.log("upload error[" + key + "]=" + error[key]);
            }
            q.reject(error);
          }, options);
        return q.promise;
      }
    };
  })
;
