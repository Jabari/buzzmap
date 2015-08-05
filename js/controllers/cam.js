angular.module('AppCtrl', ['ngCordova'])
	app.controller('CamCtrl', ['$scope', function($scope, $cordovaCapture) {
		document.addEventListener("deviceready", function () {
			console.log('take video');
		// capture callback
		$scope.videocam = function() {
			console.log('take video');
		    var options = { limit: 2, duration: 60 };

		    $cordovaCapture.captureVideo(options).then(function(videoData) {
		      // Success! Video data is here
		      	var i, path, len;
			    for (i = 0, len = videoData.length; i < len; i += 1) {
			        path = videoData[i].fullPath;
			        // do something interesting with the file
			    }
		    }, function(err) {
		      // An error occurred. Show a message to the user
		      alert('Your device caused a camera error.' + err.code);
		    });
		}
		}, false);
}]);
	/**
	'use strict';
angular.module('AppCtrl', ['ngCordova'])
	app.controller('CamCtrl', ['$scope', '$cordovaCapture', function($scope, $cordovaCapture) {
		$ionicPlatform.ready(function() {
		// capture callback
			$scope.videocam = function() {
			    var options = { limit: 2, duration: 60 };

			    $cordovaCapture.captureVideo(options).then(function(videoData) {
			      // Success! Video data is here
			      	var i, path, len;
				    for (i = 0, len = videoData.length; i < len; i += 1) {
				        path = videoData[i].fullPath;
				        // do something interesting with the file
				    }
			    }, function(err) {
			      // An error occurred. Show a message to the user
			      alert('Your device caused a camera error.' + err.code);
			    });
			}
		}
	}]);
	**/