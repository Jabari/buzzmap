angular.module('buzzmap.services', ['ngResource'])
// following code borrowed from My Bike Lane
app.factory('Photo', function($q, $cordovaCamera, $cordovaCapture, $state, $cordovaFileTransfer) {
  return {
    takePicture: function() {
      var q = $q.defer();
      if (typeof Camera === 'undefined') {
        var error = 'Camera is not available';
        console.log(error);
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
    selectPicture: function() {
      console.log('selectPicture');
      var q = $q.defer();
      if (typeof Camera === 'undefined') {
        var error = 'Camera is not available';
        console.log(error);
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
            console.log('imageData: ' + imageData);
          },
          function(error) {
            console.log("Failed to get photo from library: " + JSON.stringify(error));
            q.reject(error);
          });
      }
      console.log('promise reached');
      return q.promise;
    },
    takeVideo: function() {
      console.log("takeVidService");
      var q = $q.defer();
      if (typeof Camera === 'undefined') {
        var error = 'Camera is not available';
        console.log(error);
        q.reject(error);
      } else {
        var options = {
          duration: 61, 
          video: true, 
          audio: true,
          limit: 1
        };
        $cordovaCapture.captureVideo(options).then(
          function(imageData) {
            q.resolve(imageData);
          },
          function(error) {
            //$ionicPopup.alert({template: 'Oops, your phone had an error while taking the video' + error});
            console.log('Camera error code: ' + error.code, JSON.stringify(error));
            q.reject(error);
          });
      }
      return q.promise; 
    },
    selectVideo: function() {
      console.log('selectPicture');
      var q = $q.defer();
      if (typeof Camera === 'undefined') {
        var error = 'Camera is not available';
        console.log(error);
        q.reject(error);
      } else {
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
          mediaType: Camera.MediaType.VIDEO
        };
        $cordovaCamera.getPicture(options).then(
          function(imageData) {
            q.resolve(imageData);
            console.log('imageData: ' + imageData);
          },
          function(error) {
            console.log("Failed to get photo from library: " + JSON.stringify(error));
            q.reject(error);
          });
      }
      console.log('promise reached');
      return q.promise;
    },
    uploadPicture: function(imageData) {
      console.log('uploadPicture service');
      var s3Uploader = (function () {

        var s3URI = encodeURI("https://bm-vids.s3.amazonaws.com/"), //destinationBucket.s3.amazonaws.com
            policyBase64 = "ew0KICAgICAgICAgICAgImV4cGlyYXRpb24iOiAiMjAyMC0xMi0zMVQxMjowMDowMC4wMDBaIiwNCiAgICAgICAgICAgICJjb25kaXRpb25zIjogWw0KICAgICAgICAgICAgICAgIHsiYnVja2V0IjogImJtLXZpZHMifSwNCiAgICAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sDQogICAgICAgICAgICAgICAgeyJhY2wiOiAncHVibGljLXJlYWQnfSwNCiAgICAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sDQogICAgICAgICAgICAgICAgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDUyNDI4ODAwMDAwMF0NCiAgICAgICAgICAgIF0NCiAgICAgICAgfQ==";        
            signature = "f07c45acbb7d6e1c9eb23a162eaceb98fdffde55b9cb1bc9779a43d273d84c6f",
            awsKey = 'AKIAJK4WHLT524HC6YPA',
            acl = "public-read";

        function upload(imageData) {

          var deferred = $.Deferred(),
              ft = new FileTransfer(),
              options = new FileUploadOptions();

          options.fileKey = "file";
          options.fileName = fileName;
          options.mimeType = "image/jpeg";
          options.chunkedMode = false;
          options.params = {
              "key": fileName,
              "AWSAccessKeyId": awsKey,
              "acl": acl,
              "policy": policyBase64,
              "signature": signature,
              "Content-Type": "image/jpeg"
          };

          ft.upload(imageURI, s3URI,
              function (e) {
                  deferred.resolve(e);
              },
              function (e) {
                  deferred.reject(e);
              }, options);

          return deferred.promise();

        }

        return {
            upload: upload
        }

      }());
      
    },
    //upload
    uploadPicture1: function(imageData) {
      console.log('uploadPicture service');
      AWS.config = new AWS.Config();
        //AWS.config.accessKeyId = "AKIAJFG7B7NV4RSY23DA";
        //AWS.config.secretAccessKey = "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";
        AWS.config.accessKeyId = "AKIAJK4WHLT524HC6YPA";
        AWS.config.secretAccessKey = "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";
        var bucket = new AWS.S3({params: {Bucket: 'bm-vids'}});
        var params = {
          Key: "file", 
          ContentType: "image/jpeg", 
          Body: "data:image/jpeg;base64," + imageData
        }
        bucket.upload(params, function (err, data) {
          console.log(params);
          console.log("err: " + err);
          console.dir(data);
          console.log(data.Location);
          //var parts = pathname.split(/\//);
          //document.getElementById('upload_url').value = data.Location;
          
        });
    }
    //upload
  };
  //return
})