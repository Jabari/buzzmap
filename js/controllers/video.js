'use strict';
angular.module('AppCtrl',
        [
            "ngSanitize",
            "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "com.2fdevs.videogular.plugins.overlayplay",
            "com.2fdevs.videogular.plugins.poster",
            "com.2fdevs.videogular.plugins.buffering"
        ]
    )
app.controller('VidCtrl', function ($sce, $timeout, $scope, $http) {
    document.addEventListener('deviceready', function() {        
            
            console.log("video.js");
            var controller = this;
            controller.state = null;
            controller.API = null;
            controller.currentVideo = 0;

            controller.onPlayerReady = function(API) {
                controller.API = API;
            };

            controller.onCompleteVideo = function() {
                controller.isCompleted = true;

                controller.currentVideo++;

                if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

                controller.setVideo(controller.currentVideo);
            };

            controller.videos = [
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("https://console.developers.google.com/m/cloudstorage/b/bm-vids/o/%20Bus%20driver%20flies%20through%20windshield.mp4"), type: "video/mp4"}
                ]
            },
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("https://console.developers.google.com/m/cloudstorage/b/bm-vids/o/Silent%20Disco%20on%20the%20Bart%20last%20night....mp4"), type: "video/mp4"}    
                ]
            },
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("https://console.developers.google.com/m/cloudstorage/b/bm-vids/o/Man%20dives%20into%20water%20comes%20face%20to%20face%20with%20great%20white%20shark.mp4"), type: "video/mp4"}
                ]
            }
        ];
            $scope.videos = controller.videos;
            console.log("video.js " + $scope.videos);
            controller.config = {
                preload: "none",
                autoHide: false,
                autoHideTime: 2000,
                autoPlay: true,
                sources: controller.videos[0].sources,
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };

            controller.setVideo = function(index) {
                controller.API.stop();
                controller.currentVideo = index;
                controller.config.sources = controller.videos[index].sources;
                $timeout(controller.API.play.bind(controller.API), 100);
            };
        }, false);
    });
