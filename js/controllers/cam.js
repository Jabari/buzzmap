angular.module('AppCtrl', ['ionic', 'ngCordova', 'buzzmap.services'])
app.controller('CamCtrl', ['$scope', '$cordovaCapture', '$ionicPlatform', '$state', '$ionicPopup', '$cordovaCamera', 'Photo', function($scope, $cordovaCapture, $ionicPlatform, $state, $ionicPopup, $cordovaCamera, Photo) {
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
						$scope.selectPicture();
						
					}
				},
				{
				  	text: '',
					type: 'button-positive ion-videocam',
					onTap: function(e){
						//$scope.videocam();
						$scope.takePicture();
					}
				}]
			});
			// following code borrowed from My Bike Lane
			$scope.takePicture = function() {
				console.log('takePicture');
		      	Photo.takePicture().then(function(imageData) {
			        $scope.imageViewData = imageData;
			        $scope.imageUploadData = imageData;
			        $scope.uploadPicture(imageData);
			    });
		    };
		    $scope.selectPicture = function() {
		    	console.log('selectPicture');
				Photo.selectPicture().then(function(imageURI) {
					$scope.imageViewData = ' ';
					$scope.imageUploadData = imageURI;
					$scope.uploadPicture(imageURI);
				  //var image = document.getElementById('reportImage');
				  //image.src = imageURI;
				});
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
					$scope.uploadPicture(imageURI);
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

		    //Following code is older code
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

		}

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
				**/
			});
		}

	});
}]);