angular.module('buzzmap.services', ['ngResource'])
app.constant('fbUrl', 'https://buzzmapv0.firebaseio.com/')
app.constant('fbRef', new Firebase("https://buzzmapv0.firebaseio.com/"))
app.constant('fbRefVids', new Firebase("https://buzzmapv0.firebaseio.com/videos"))
app.constant('fbRefUsers', new Firebase("https://buzzmapv0.firebaseio.com/users"))
app.factory('SynchFactory', function($cordovaFileTransfer, $cordovaProgress, $ionicHistory, $ionicLoading, $state, $firebase, fbUrl, $q) {
  return {
    uploadVideo: function(file, filename) {
        
        console.log(file);
        //var filetype = "image/jpeg";
        get_signed_request(file);

        function get_signed_request(file) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://52.27.180.252/s3_signed_url?file_name="+filename+"&file_type="+file.type);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        upload_file(file, response.signed_request, response.url, filename);
                    } else {
                        alert("Could not get signed URL.");
                    }
                }
            };
            xhr.send();
        }

        function upload_file(file, signed_request, url, filename, trustAllHosts) {
            console.log(file, signed_request, url, filename);
            angular.element(document.querySelector("#progress")).addClass("in");
            angular.element(document.querySelector("#progress > h1")).html("0% uploaded");
            $cordovaProgress.showBar(true, 50000);
            var xhr = new XMLHttpRequest();

            var options = {
               fileKey: "video",
               fileName: filename,
               chunkedMode: false,
               mimeType: file.type,
               httpMethod: "PUT",
               // params : {
                // "key": filename,
                // "acl": 'public-read',
                // 'x-amz-acl': 'public-read'
                // "signature": signed_request,
                // "Content-Type": file.type
               // }
              // params : {
              //     "key": fileName,
              //     "AWSAccessKeyId": awsKey,
              //     "acl": acl,
              //     "policy": policyBase64,
              //     "signature": signature,
              //     "Content-Type": "image/png"
              // }
            };

            console.log(file[0].fullPath);
            /**
            $cordovaFileTransfer.upload(signed_request, file[0].fullPath, options)
            .then(function(result) {
               console.log("SUCCESS: " + JSON.stringify(result.response));
            }, function(err) {
               console.log("ERROR: " + JSON.stringify(err));
            }, function(progress) {
               // constant progress updates
            });
            **/
            
            var q = $q.defer();
            var ft = new FileTransfer();
            var uri = (options && options.encodeURI === false) ? signed_request : encodeURI(signed_request);

            if (options && options.timeout !== undefined && options.timeout !== null) {
              $timeout(function () {
                ft.abort();
              }, 
              options.timeout);
              options.timeout = null;
            }

            ft.onprogress = function (progress) {
              q.notify(progress);
            };

            q.promise.abort = function () {
              ft.abort();
            };

            ft.upload(file[0].fullPath, uri, q.resolve, q.reject, options, trustAllHosts);
            return q.promise;
            
            // xhr.open("PUT", signed_request);
            // xhr.setRequestHeader('x-amz-acl', 'public-read');
            // // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            // xhr.onload = function() {
            //     angular.element(document.querySelector("#progress")).removeClass("in");
            //     if (xhr.status === 200) {
            //         $cordovaProgress.showSuccess(true, "Successful upload!");
            //         alert("File has been uploaded.");
            //         //$cordovaProgress.hide();
            //     }
            // };

            // xhr.onerror = function() {
            //     angular.element(document.querySelector("#progress")).removeClass("in");
            //     alert("Could not upload file.");
            // };

            // xhr.upload.onprogress = function(e) {
            //   if (e.lengthComputable) {
            //     var percentLoaded = Math.round((e.loaded / e.total) * 100);
            //     angular.element(document.querySelector("#progress > h1")).html(percentLoaded+"% uploaded");
            //     $cordovaProgress.showBarWithLabel(false, 50000, percentLoaded);
            //   }
            // };
            // xhr.send(file);
        } //upload_file 
    
    //};    
    },//uploadVideo
    fbVidSync: function(vidMeta) { //fb_video_metadata_sync
        var ref = new Firebase(fb_rt + 'videos');
        ref.on('child_added', function(snapshot, event) {
            console.log(snapshot.val());
            var vidid = snapshot.val().length++;
            ref.child(vidid).set({
                Lat: vidMeta.lat,
                Lng: vidMeta.lng,
                t_posted: vidMeta.t_posted,
                t_occ: vidMeta.t_occ,
                title: vidMeta.vidTitle,
                vidid: vidid,
                category: vidMeta.vidCat,
                description: vidMeta.vidDescription,
                tags: vidMeta.vidTags,
                url: vidMeta.vidUrl,
                comments: [],
                twit : 0,
                fb : 0,
                gplus : 0,
                redd: 0,
                wapp: 0,
                copy : 0,
                sms : 0,
                views : 0,
                ups : 0,
                downs: 0,
                flags : 0,
                mod : 0
            }, onComplete);
        }) //ref.on

        var onComplete = function(error) {
            if (error) {
                console.log('Synchronization failed');
                $ionicPopup.alert({'templete': 'Synchronization failed'});
            } else {
                //upload++;
                $ionicLoading.show({
                  template: 'Successful post!',
                  noBackdrop: true,
                  duration: 2000
                });
                console.log('Upload & Synchronization succeeded' + upload);
                //console.log(vidUrl);
                //document.getElementById('button-bg').style.top = "0px";
                location.href = location.origin;
            }
        }
    } //fbVidSync
  } //return
})