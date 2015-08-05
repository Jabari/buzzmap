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
.controller('VidCtrl',
        ["$sce", "$timeout", "$scope", "$http", function ($sce, $timeout, $scope, $http) {
            
            /**
            $http.get('http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json').success(function(data) {
                $scope.items = data.feed.entry;
                for(var i = 0;i<$scope.items.length;i++) 
                console.log($scope.items[i].url + '\n');
            }).error(function(data) {
                alert('cannot fetch youtube API');
            });
            **/
            
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
            console.log($scope.videos);
            controller.config = {
                preload: "none",
                autoHide: false,
                autoHideTime: 2000,
                autoPlay: false,
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
        }]
    );
