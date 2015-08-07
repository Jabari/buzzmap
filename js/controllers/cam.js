angular.module('AppCtrl', ['ionic', 'ngCordova'])// 'buzzmap.services',
app.controller('CamCtrl', ['$scope', '$cordovaCapture', '$ionicPlatform', '$state', '$ionicPopup', '$cordovaCamera', 'Photo', '$q', '$cordovaFileTransfer', '$ionicLoading', function($scope, $cordovaCapture, $ionicPlatform, $state, $ionicPopup, $cordovaCamera, Photo, $q, $cordovaFileTransfer, $ionicLoading) {
	ionic.Platform.ready(function() {
		// capture callback
		
		$scope.postVid = function() {
			console.log('postVid');

			var popup = $ionicPopup.show({
				template: '',
				cssClass: '',
				title: '',
				subtitle: '',
				scope: $scope,
				buttons: [
				{
					text: '',
					type: 'button-stable ion-ios7-film',
					onTap: function(e){
						//$scope.chooseVid();
						$scope.selectVideo();
						
					}
				},
				{
				  	text: '',
					type: 'button-positive ion-ios7-videocam',
					onTap: function(e){
						//$scope.videocam();
						$scope.recordVideo();
					}
				}]
			});
			// below, there are many functions with similar functionality
			//-take video or image and upload to AWS S3 bucket - https://bm-vids.s3-website-us-west-1.amazonaws.com/
			//Please fix app so files are uploaded to AWS S3 either unsecurely (directly from client without server)
			//or securely (signed by script on server)
			$scope.takePicture = function() {
				console.log('takePicture');
		      	Photo.takePicture().then(function(imageData) {
			        $scope.imageViewData = imageData;
			        $scope.imageUploadData = imageData;
			        $scope.uploadPicture(imageData);
			    });
		    };
		    $scope.snap = function() {
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
		    };
		    $scope.takePic = function (e) {
		    	var s3Uploader = (function () {

		        var s3URI = encodeURI("https://bm-vids.s3-website-us-west-1.amazonaws.com/"), //destinationBucket.s3.amazonaws.com
		            policyBase64 = "ew0KICAgICAgICAgICAgImV4cGlyYXRpb24iOiAiMjAyMC0xMi0zMVQxMjowMDowMC4wMDBaIiwNCiAgICAgICAgICAgICJjb25kaXRpb25zIjogWw0KICAgICAgICAgICAgICAgIHsiYnVja2V0IjogImJtLXZpZHMifSwNCiAgICAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sDQogICAgICAgICAgICAgICAgeyJhY2wiOiAncHVibGljLXJlYWQnfSwNCiAgICAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sDQogICAgICAgICAgICAgICAgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDUyNDI4ODAwMDAwMF0NCiAgICAgICAgICAgIF0NCiAgICAgICAgfQ==";        
		            signature = "f07c45acbb7d6e1c9eb23a162eaceb98fdffde55b9cb1bc9779a43d273d84c6f",
		            awsKey = 'AKIAJFG7B7NV4RSY23DA',
		            acl = "public-read";

		        function upload(imageURI, fileName) {
		          var q = $q.defer(),
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
		                  q.resolve(e);
		              },
		              function (e) {
		                  q.reject(e);
		              }, options);

		          //return deferred.promise();
		          return q.promise ;

		        }

		        return {
		            upload: upload
		        }

		      }());
	            var options = {
	                quality: 50,
	                targetWidth: 100,
	                targetHeight: 100,
	                destinationType: Camera.DestinationType.FILE_URI,
	                encodingType: Camera.EncodingType.JPEG,
	                sourceType: Camera.PictureSourceType.CAMERA,
	            };
	            $cordovaCapture.captureVideo(options).then(function(imageData) {
		          $scope.picData = imageData;
		          $scope.ftLoad = true;
		          $scope.uploadVideo(imageData);
		          $ionicLoading.show({template: 'Successfully recorded.', duration:500});
		          },
		          function(err){
		          $ionicLoading.show({template: 'Failed to record video'});
		        });

	            return false;

	        };
	        
		    $scope.recordVideo = function() {
				var options = {
					limit: 1,
					quality: 50,
					duration: 61,
					destinationType: Camera.DestinationType.FILE_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					saveToPhotoAlbum: true
				};
				$cordovaCapture.captureVideo(options).then(function(imageData) {
					//$scope.picData = imageData;
					$scope.ftLoad = true;
					$scope.uploadVid(imageData[0].fullPath);
					$ionicLoading.show({template: 'Successfully recorded.', duration:500});
				},
				function(err){
					$ionicLoading.show({template: 'Failed to record video' + err, duration:2500});
					console.log(err);
				});
			};

			$scope.uploadVideo = function(imageData) {
		        var q = $q.defer();
		        if (typeof imageData === 'array') {
		        	imageData = imageData[0].fullPath;
		        	console.log('array');
		        };
		        var options = new FileUploadOptions();
		        options.fileKey = "file";
		        options.fileName = "video.mp4";
		        options.mimeType = "video/mp4";
		        options.chunkedMode = false; // Absolutely required for https uploads!
		        options.params = {};

		        var ft = new FileTransfer();
		        //$cordovaFileTransfer
		        ft.upload(imageData, encodeURI('http://www.buzzmap.co/upload.php'),
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
		    };
		    
			
			$scope.uploadVid = function(imageData) {
				var fileName = imageData[0].lastModifiedDate+'_'+imageData[0].name,
					date = imageData[0].lastModifiedDate,
					fileURL = imageData[0].localURL;
					//fileURL = 'file:///sdcard/Android/data/com.ionicframework.buzzmap861576/cache/1438198100417.jpg';
				
				var s3URI = encodeURI("https://bm-vids.s3.amazonaws.com/"), //destinationBucket.s3.amazonaws.com
		            policyBase64 = "ew0KICAgICAgICAgICAgImV4cGlyYXRpb24iOiAiMjAyMC0xMi0zMVQxMjowMDowMC4wMDBaIiwNCiAgICAgICAgICAgICJjb25kaXRpb25zIjogWw0KICAgICAgICAgICAgICAgIHsiYnVja2V0IjogImJtLXZpZHMifSwNCiAgICAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sDQogICAgICAgICAgICAgICAgeyJhY2wiOiAncHVibGljLXJlYWQnfSwNCiAgICAgICAgICAgICAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sDQogICAgICAgICAgICAgICAgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDUyNDI4ODAwMDAwMF0NCiAgICAgICAgICAgIF0NCiAgICAgICAgfQ==";        
		            signature = "ReOg4XYvUFYZog%2BU9WiQnHrrwWw%3D",
		            //c2721f6c8c590d79f94ebba75ffb1666ff9ccc69cca9608c23fc0472f273def7
		            awsKey = 'AKIAJK4WHLT524HC6YPA',
		            //AKIAJK4WHLT524HC6YPA
		            //ueg0j5wjZG1vzjVPIkG/A/DxqgXn43mJy6maTEaP
		            acl = "public-read";
				var options = new FileUploadOptions();
				options.fileKey = "file";
				options.fileName = Date.now() + "video.mp4";//fileURL.substr(fileURL.lastIndexOf('/') + 1)
				options.mimeType = "video/mp4";
				options.chunkedMode = false;
				options.params = {
				    "key": "file",
				    "AWSAccessKeyId": awsKey,
				    "acl": acl,
				    "policy": policyBase64,
				    "signature": signature,
				    "Content-Type": "video/mp4" //application/octet-stream
				};
				console.log(options);


				var ft = new FileTransfer();
				//$cordovaFileTransfer
				//"http://wwwbuzzmap.co/upload.php"
				ft.upload(imageData, encodeURI("https://bm-vids.s3.amazonaws.com/"), 
				  function(result) { 
				    $ionicLoading.show({content: 'Loading Data', animation: 'fade-in',showBackdrop: true, maxWidth: 200,duration:500});
				  }, function(err) { 
				    $ionicLoading.show({template: 'Failed to upload video' + err, duration: 2500});
				    console.log(err);
				  }, options);
			};

		    $scope.takeVideo = function() {
				console.log('takeVid');
		      	Photo.takeVideo().then(function(imageData) {
			        $scope.imageViewData = imageData;
			        $scope.imageUploadData = imageData;
			        //$scope.imageUploadData = dataURItoBlob("data:video/mp4;base64,"+imageData);
			        $scope.uploadPicture(imageData);
			    });
		    };
		    $scope.selectVideo = function() {
		    	console.log('selectPicture');
				Photo.selectVideo().then(function(imageURI) {
					$scope.imageViewData = ' ';
					$scope.imageUploadData = imageURI;
					//$scope.uploadPicture(imageURI);
					$scope.uploadVid(imageURI);
				});
		    };
		    $scope.uploadPicture = function() {
		    	console.log('uploadPicture controller');
		      	Photo.uploadPicture($scope.imageUploadData).then(function(response) {
		        	$scope.afterSubmit();
		      	});
		    };
		    $scope.afterSubmit = function() {
		      console.log('Submitted');
		    };

		    //Following code is older
			$scope.chooseVid = function() {
				popup.close();
				console.log('chooseVid'); 
				//lets user select video from camera roll
				navigator.camera.getPicture(success, error, options);

				var success = function(fileURI) {
				    $state.go('upload');
				}

				var error = function(err) {
					$ionicPopup.alert({template: 'Oops, your phone had an error with your video.'});
					console.log('Failed because: ' + err);
				}
				var options = { 
					quality : 50,
					destinationType : Camera.DestinationType.FILE_URI,
					sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
					mediaType: Camera.MediaType.VIDEO,
					saveToPhotoAlbum: false 
				};

			}

			$scope.videocam = function() {
				popup.close();
				console.log('videocam');
				$state.go('upload');

				// start video capture
				$cordovaCapture.captureVideo(captureSuccess, captureError, options);
			    
			    var captureSuccess = function(mediaFiles) {
			    	console.log('take video');
				    var i, path, len, file;
				    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				    	file = mediaFiles[i];
				        path = mediaFiles[i].fullPath;
				        
				    }
				    $state.go('upload');
				};

				var captureError = function(error) {
					$ionicPopup.alert({template: 'Oops, your phone made an error while capturing your video' + error});
				    console.log('Error code: ' + error.code, null, 'Camera Error');
				};

				var options = {duration: 60, video: true, audio: true};
				
			    /*
			    navigator.getUserMedia(options, captureSuccess, captureError), function(stream) {
	    			video.src = window.URL.createObjectURL(stream);
	  			};
				**/			    
			}

		};

		/**
		$scope.takePic = function() {
			navigator.camera.getPicture(success, error, options);

			var success = function(imageURI) {
			    $state.go('upload');
			}

			var error = function(err) {
				$ionicPopup.alert({template: 'Oops, your phone made an error while taking your picture'});
				console.log('Failed because: ' + err);
			}
			
		}
		var options = { 
				quality : 50,
				destinationType : Camera.DestinationType.FILE_URI,
				sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
				mediaType: Camera.MediaType.PICTURE,
				sourceType : Camera.PictureSourceType.CAMERA,
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100
			};
			**/
		$scope.camera = function(){
			$cordovaCamera.getPicture(options).then(function(imageData) {
				var image;
			    // 4
			    image.data = imageData;
			    image.type = 'image/jpeg'

				onImageSuccess(imageData);

				function onImageSuccess(fileURI) {
					createFileEntry(fileURI);
					console.log('onImageSuccess');
					console.log('fileURI: ' + fileURI);
				}

				function createFileEntry(fileURI) {
					window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
				}

				// 5
				function copyFile(fileEntry) {
					var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
					var newName = makeid() + name;
					image.name = newName

					window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
					fileEntry.copyTo(
					  fileSystem2,
					  newName,
					  onCopySuccess,
					  fail
					);
					},
					fail);
					//upload to S3
					upload(image);
				}

				function upload(imageURI, fileName) {
		          var q = $q.defer(),
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
		                  q.resolve(e);
		              },
		              function (e) {
		                  q.reject(e);
		              }, options);

		          //return deferred.promise();
		          return q.promise ;

		        }
				
			});
		}
	});
}]);