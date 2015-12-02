angular.module('AppCtrl', ['ionic', 'ngCordova'])// 'buzzmap.services',
app.controller('CamCtrl', ['$scope', '$cordovaCapture', '$ionicPlatform', '$state', '$ionicPopup', '$cordovaCamera', '$q', '$cordovaFileTransfer', '$ionicLoading', '$http', 'SynchFactory', function($scope, $cordovaCapture, $ionicPlatform, $state, $ionicPopup, $cordovaCamera, $q, $cordovaFileTransfer, $ionicLoading, $http, SynchFactory) {
	ionic.Platform.ready(function() {
		// capture callback
		
		$scope.postVid = function() {
			console.log('postVid');
			
			var popup = $ionicPopup.show({
				template: '<div ng-controller="UploadCtrl"><input type="file" id="file_input" accept="video/*" capture></div>',
				cssClass: '',
				title: '',
				subtitle: '',
				scope: $scope,
				buttons: [
				{
					text: 'file input',
					type: 'button-stable',
					onTap: function(e){
						popup.close();
					}
				},
				{
					text: '',
					type: 'button-stable ion-ios7-film',
					onTap: function(e){
						$scope.selectVideo();
					}
				},
				{
				  	text: '',
					type: 'button-positive ion-ios7-videocam',
					onTap: function(e){
						$scope.recordVideo();
					}
				}]
			});
			
			$scope.selectVideo = function() {
				popup.close();
				//lets user select video from camera roll
				var success = function(imageURI) {
				    //substr(imageData.lastIndexOf('/') + 1);
				    ////var file = resolveLocalFileSystemURL(imageURI);
				    //var filename = window.resolveLocalFileSystemURL(imageURI);
				    console.log(imageURI);
				    var file = imageURI;
				    var filename = imageURI.substring((imageURI.lastIndexOf('/') + 1), imageURI.length);
				    console.log(file, filename);
				    SynchFactory.uploadVideo(file, filename);
				}

				var error = function(err) {
					$ionicLoading.show({template: 'Oops, there was an error selecting your video' + err.message, duration:1800});
					console.log('Failed because: ' + err);
				}
				var options = { 
					quality : 50,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
					mediaType: Camera.MediaType.VIDEO,
				};
				navigator.camera.getPicture(success, error, options);

			}

			$scope.recordVideo = function() {
				popup.close();

		        var options = {
		            limit: 1,
					duration: 61,
					quality : 50,
		            destinationType : Camera.DestinationType.DATA_URL,
		            sourceType : Camera.PictureSourceType.CAMERA,
		            mediaType: Camera.MediaType.VIDEO,
		            saveToPhotoAlbum: false
		        };
		        
		        $cordovaCapture.captureVideo(options).then(function(imageData) {
		            if (imageData) {
		           	var filename = Date.now() + 'vid.mp4';	       
	                  SynchFactory.uploadVideo(imageData, filename);
	                }
	                $ionicLoading.show({template: 'Successfully recorded.', duration:1800});
		        }, function(err) {
		        	$ionicLoading.show({template: 'Failed to record video' + err.message, duration:1800});
		            console.error(err);
		        });
		    }
			/**
			$scope.upload = function() {
		        var options = {
		            quality : 75,
		            destinationType : Camera.DestinationType.FILE_URI,
		            sourceType : Camera.PictureSourceType.CAMERA,
		            allowEdit : true,
		            encodingType: Camera.EncodingType.JPEG,
		            popoverOptions: CameraPopoverOptions,
		            targetWidth: 500,
		            targetHeight: 500,
		            saveToPhotoAlbum: false
		        };
		        $cordovaCamera.getPicture(options).then(function(imageData) {
		        	
		            if (imageData) {
		           	var filename = Date.now() + 'pic.jpg';       
	                  SynchFactory.uploadVideo(imageData, filename);
	                }
		            alert("Image has been uploaded");

		        }, function(error) {
		            console.error(error);
		        });
		    }

			$scope.Pic = function() {				
			
				var cameraOptions = { 
					quality : 50,
					destinationType : Camera.DestinationType.FILE_URI,
					sourceType : Camera.PictureSourceType.CAMERA,
					saveToPhotoAlbum: false 
				};
				navigator.camera.getPicture(function(imageURI) {

				var file1 = resolveLocalFileSystemURL(imageURI);
				    var filename = window.resolveLocalFileSystemURL(imageURI);
				    console.log(file1, filename);
				    //SynchFactory.uploadVideo(file1, filename);
			    
				console.log("data:image/jpeg;base64," + imageURI);
				
				}, function(err) {

				// Ruh-roh, something bad happened
				$ionicPopup.alert({template: 'Oops, there was an error with your videos'});
				console.log('Failed because: ' + err);
				}, cameraOptions);
				
			}

		    $scope.send = function(FILE_URI) {   
		        var myImg = $scope.picData;
		        var options = new FileUploadOptions();
		        options.fileKey="post";
		        options.chunkedMode = false;
		        var params = {};
		        params.user_token = localStorage.getItem('auth_token');
		        params.user_email = localStorage.getItem('email');
		        options.params = params;
		        var ft = new FileTransfer();
		        ft.upload(myImg, encodeURI("https://example.com/posts/"), onUploadSuccess, onUploadFail, options);
		        
		        //substr(imageData.lastIndexOf('/') + 1);
		        var filename = $scope.picData.substring($scope.picData.lastIndexOf('/') + 1);
		        console.log($scope.picData, filename);
		        SynchFactory.uploadVideo($scope.picData, filename);
		    }
			**/
	    }
	});
      
}]);