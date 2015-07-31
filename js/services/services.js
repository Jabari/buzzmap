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
          audio: true
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
      var q = $q.defer();

      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = "AKIAJFG7B7NV4RSY23DA";
      AWS.config.secretAccessKey = "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";
      var bucket = new AWS.S3({params: {Bucket: 'bm-vids'}});
      var params = {
        Key: Date.now() + imageData[0].name, 
        ContentType: "image/jpeg", 
        Body: imageData[0].fullPath //how do I insert ACTUAL file here???
      }
      /**
      var params = {
        Key: Date.now() + "video.mp4", 
        ContentType: "video/mp4", 
        Body: blob
      };
      **/
      bucket.upload(params, function (err, data) {
        console.log(params);
        console.log("err: " + err);
        console.dir(data);
        console.log(data.Location);        
      });
      /**
      function dataURItoBlob(imageData) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        console.log(imageData);
        var byteString;
        if (imageData.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(imageData.split(',')[1]);
        else
            byteString = unescape(imageData.split(',')[1]);

        // separate out the mime component
        var mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
      }
      **/
      
      function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        //encodeURI(dataURI);

        /**
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
      }
      function _arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
        **/
    };
    
      /**
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++)
        {
          ia[i] = byteString.charCodeAt(i);
        }

        var bb = new Blob([ab], { "type": mimeString });
        return bb;
      }
      **/
      //From there, appending the data to a form such that it will be uploaded as a file is easy:

      //var dataURL = canvas.toDataURL('image/jpeg', 0.5);
      //var blob = dataURItoBlob(imageData);
      //console.log(blob);
      //var blob1 = dataURItoBlob("data:image/jpeg;base64,"+imageData);
      //console.log(blob);
      //var fd = new FormData(document.forms[0]);
      //fd.append("canvasImage", blob);
      //file = file.substring(location.pathname.lastIndexOf('/')+1);
      //var filename = imageData[0].fullPath.split(/\//).pop();
      //console.log("filename: " + filename);
      //check it out on iOS
      
      /**
      var options = new FileUploadOptions();
      options.fileKey = "image";
      options.fileName = "report.jpg";
      options.mimeType = "image/jpeg";
      options.chunkedMode = false; // Absolutely required for https uploads!
      options.params = {};

      var ft = new FileTransfer();var url = "https://bm-vids.s3-website-us-west-1.amazonaws.com";
      ft.upload(imageData, encodeURI('ApiUrl.get() + '/photos.json''),
      //ft.upload(imageData, encodeURI(ApiUrl.get() + '/photos.json'),
        function(response) {
          console.log("Done uploading file");
          q.resolve(response);
        },
        function(error) {
          for (var key in error) {
            console.log("upload error[" + key + "]=" + error[key]);
          }
          q.reject(error);
        }, options);
        **/
      return q.promise;       
    }
    //upload
  };
  //return
})
