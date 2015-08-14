'use strict';
angular.module('AppCtrl', ['ngMap', 'Auth', 'ngCordova'])
app.controller('MapGeolocationCtrl', ["$scope", "$cordovaGeolocation", "$timeout", "$ionicModal", "$ionicLoading", "$sce", "$cordovaToast", "timeAgo", "nowTime", "PinFactory", "map_style", "$ionicPopup", function($scope, $cordovaGeolocation, $timeout, $ionicModal, $ionicLoading, $sce, $cordovaToast, timeAgo, nowTime, PinFactory, map_style, $ionicPopup) {
  //ionic.Platform.ready(function() {
    $scope.$on('mapInitialized', function(event, map) {
      // designed on snazzymaps.com
      var mapStyle = map_style.style1();
      map.setOptions({styles: mapStyle, zoom: 12, maxZoom: 16, minZoom: 5, keyboardShortcuts: false}); 
      
      //if(navigator.geolocation || !navigator.geolocation) {
        var posOptions = {
          timeout: 6000, 
          enableHighAccuracy: false, //coarse location resolves faster than fine...
          maximumAge : 0
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
          $scope.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          console.log(position);
          console.log($scope.pos);                                 
          var userLoc = {
            fillColor: 'gold',
            path: 'M -2,0 0,-2 2,0 0,2 z',
            fillOpacity: 0.8,
            scale: 3
          };
          //marker designating user location
          var marker = new google.maps.Marker({
            position: $scope.pos,
            icon: userLoc,
            map: map
          });

          google.maps.event.addListener(marker, 'click', function(marker) {
            $ionicLoading.show({
              template: 'This is your current location',
              duration: 1800
            });
          });
          //hide loading blocker once map has loaded
          google.maps.event.addListenerOnce(map, 'idle', function(){
              $ionicLoading.hide();
          });
          map.setCenter($scope.pos);

          $scope.home = function() {
            map.setCenter($scope.pos);
          }
          //remove top header from map screen
          var removeMapHeader = document.getElementById("map");
          removeMapHeader.classList.remove("has-header");   
        },
        function(err) {
          console.log('Error retrieving location: ' + err.code + " : " + err.message);
          //err.code = 0: unknown error, 1: permission denied, 2, position unavilable (error response from location provider), 3: timed out
          function twitter() {
            window.open('https://twitter.com/BUZZMAPapp', '_system', 'location=yes'); 
            return false;
          }
          var popup = $ionicPopup.show({
            title: "Sorry, there's a <b>location</b> error.",
            template: "If you keep experiencing this issue, please tweet to us <a ng-href='#' ng-click='twitter()'>@BUZZMAPapp</a> and let us know.",
            cssClass: '',
            subtitle: "Reload the app to try to fix the error or just dismiss & carry on.",
            scope: $scope,
            buttons: [
            {
              text: 'Reload',
              type: 'button-positive',
              onTap: function(e){
                location.href = location.origin;
              }
            },
            {
              text: 'Dismiss',
              type: 'button-stable',
              onTap: function(e){
                popup.close();
                $ionicLoading.hide();
              }
            }]
          });
        });      
/**
        $scope.foo = function(event, arg1, arg2) {
        alert('this is at '+ this.getPosition());
        alert(arg1+arg2);
      }
**/
      //modal
      $ionicModal.fromTemplateUrl('modal-video.html', {
        id: 'video', // We need to use an ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: true,
        hardwareBackButtonClose: true,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.oModal1 = modal;
      });

      var video_player = document.getElementById("video_player");
  /**
      if (video_player.requestFullscreen) {
        console.log('fullscreen requested');
        screen.lockOrientation('landscape');
        video_player.requestFullscreen();
      } else if (i.webkitRequestFullscreen) {
        console.log('fullscreen requested');
        screen.lockOrientation('landscape');
        video_player.webkitRequestFullscreen();
      }
  **/
      document.addEventListener("fullscreenchange", function() { 
        console.log('fullscreen requested');
        if (document.fullscreenElement === null) {
          console.log('fullscreen requested');
          screen.lockOrientation('landscape');
          video_player.requestFullscreen();
        } else {
          screen.lockOrientation('portrait');
          console.log('exit fullscreen');  
        }
      });
      /**
      video_player.addEventListener("fullscreenchange", function() { 
        if (document.fullscreenElement === null) {
          console.log('fullscreen requested');
          screen.lockOrientation('landscape');
          video_player.requestFullscreen();
        } else {
          screen.lockOrientation('portrait');
          console.log('exit fullscreen');  
        }
      });
  **/
      $scope.openModal = function(index) {
        $scope.oModal1.show();
      };
      
      $scope.closeModal = function(index) {
        $scope.oModal1.hide();
        document.getElementById("video_player").pause(); 
      };

      /* Listen for broadcasted messages */
      
      $scope.$on('modal.shown', function(event, modal) {
        document.getElementById("video_player").load();
        console.log('Modal ' + modal.id + ' is shown!');
      });
      
      $scope.$on('modal.hidden', function(event, modal) {
        map.setZoom(12);
        console.log('Modal ' + modal.id + ' is hidden!');
      });
      
      $scope.$on('$destroy', function() {
        console.log('Destroying modals...');
        $scope.oModal1.remove();
      });
      //end modal
      //search for places on map
      $scope.googleMap = function() {
        console.log($scope.searchMap);

        $timeout(function() {
          $scope.toggleSearch = false;  
        }, 2000);
      };

      $scope.toggleSearch = false;
      $scope.startSearch = function() {
        $scope.toggleSearch = !$scope.toggleSearch;

        if ($scope.toggleSearch === true) {
          document.getElementById('search_map').focus();
          document.getElementById('search_map').select();
        } else {
          console.log($scope.searchMap);
        }
        console.log("toggle"); 
      };

      var searchMap = document.getElementById('search_map');

      var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(searchMap));
        
      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
    
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }
        
        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place. Instead of marker let's briefly flash a toast message of location on screen
          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          bounds.extend(place.geometry.location);

          google.maps.event.addListener(place, 'click', function() {
            $scope.toggleSearch = false;
          });
        }

        map.fitBounds(bounds);
        map.setZoom(13);
      });

      // Bias the SearchBox results towards places that are within the bounds of the
      // current map's viewport.
      google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
      });
      //end map search

      var markers = [];
      var mcOptions = {averageCenter: true, gridSize: 20, maxZoom: 12, minimumClusterSize: 2};
      $scope.markerClusterer = new MarkerClusterer(map, [], mcOptions);
      var ref = new Firebase('https://buzzmapv0.firebaseio.com/');
      //ref.limitToLast(20)
      ref.on('value', function(snapshot, event) {
        console.log("firebase value: " + snapshot.val());
        $scope.mapData = snapshot.val();
        
        console.log($scope.mapData.videos.length);

        for (var i = 0; i < $scope.mapData.videos.length; i++) {
          var lat = $scope.mapData.videos[i].Lat;
          var lng = $scope.mapData.videos[i].Lng;
          var latlng = new google.maps.LatLng(lat, lng);
          $scope.lat = lat;
          $scope.lng = lng;
          $scope.latlng = latlng;
          console.log("lat: " + lat + ", lng: " + lng);
          $scope.pin = $sce.trustAsHtml(PinFactory.setPin($scope.mapData.videos[i].cat));
          console.log($scope.mapData.videos[i].cat);
          markers[i] = new MarkerWithLabel({ 
            position: latlng, 
            //title: $scope.mapData.videos[i].title, 
            clickable: true, 
            icon: ' ',
            labelContent: $scope.pin,
            labelAnchor: new google.maps.Point(20, 40),
            labelClass: "labels", // the CSS class for the label
            labelInBackground: false,
            labelStyle: {opacity: 1},
            animation: google.maps.Animation.DROP
          });
          
          $scope.markerClusterer.addMarker(markers[i]);  

          google.maps.event.addListener(markers[i], 'click', (function(markers, i) {
            return function() {
              $scope.$apply(function () {
                $scope.title = $scope.mapData.videos[i].title;
                $scope.url = $sce.trustAsResourceUrl($scope.mapData.videos[i].url);
                $scope.username = $scope.mapData.videos[i].user;
                $scope.views = $scope.mapData.videos[i].views;
                $scope.desc = $sce.trustAsHtml($scope.mapData.videos[i].description);
                $scope.comments = $scope.mapData.videos[i].comments;
                console.log($scope.comments);
                map.setCenter(markers[i].position);
                map.setZoom(16);
                map.panBy(0, -window.innerHeight/2.1);
                $scope.views++;
                $scope.ups = $scope.mapData.videos[i].ups;
                $scope.openModal(1);
              });
            }
          })(markers, i));
          //end search for places on map    
        }
        //$scope.markerClusterer = new MarkerClusterer(map, markers, mcOptions);
        $scope.panToPin = function($scope, latlng) {
          map.setCenter(latlng);
          console.log(latlng);
          map.setZoom(13);        
        }

        $scope.addComment = function() {
          $scope.comments[ref.push().comments()] = {
            user: $scope.username, content: $scope.comment
          };
        }
        $scope.upvote = function() {
          $scope.ups++;
        }
        $scope.downvote = function() {
          $scope.ups--;
        }
      });    
      //end of firebase data & markers    
      //$ionicLoading.hide();

    //}
     /**
    else {
        $scope.pos = new google.maps.LatLng(37.7749, -122.4194);
        handleNoGeolocation(false);
        alert("Oops, location error!" + Location_err);
    }
    **/
    //navigator.geolocation  
    
  }); //$scope.$on('mapInitialized', 
  //}); //ionic.Platform.ready
}]);