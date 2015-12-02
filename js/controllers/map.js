'use strict';
angular.module('AppCtrl', ['ngMap', 'ngCordova'])
app.controller('MapGeolocationCtrl', ["$scope", "$cordovaGeolocation", "$timeout", "$ionicModal", "$ionicLoading", "$ionicHistory", "$sce", "$cordovaToast", "timeAgo", "nowTime", "PinFactory", "map_style", "$ionicPopup", "fbRef", function($scope, $cordovaGeolocation, $timeout, $ionicModal, $ionicLoading, $ionicHistory, $sce, $cordovaToast, timeAgo, nowTime, PinFactory, map_style, $ionicPopup, fbRef) {
  if ((window.localStorage.getItem("username") === null && window.localStorage.getItem("password") === null) || (window.localStorage.getItem("username") === "undefined" && window.localStorage.getItem("password") === "undefined"))
  {
    return
  } else {
    $ionicHistory.clearHistory();
    $scope.$on('mapInitialized', function(event, map) {
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
          //shen user taps on ^marker^
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
          //pans map back to user location
          $scope.home = function() {
            map.setCenter($scope.pos);
          }
          
          //remove top header from map screen
          var removeMapHeader = document.getElementById("map");
          removeMapHeader.classList.remove("has-header");   
        },
        function(err) {
          $scope.home = function() {
              $ionicLoading.show({
                template: "You're location can't be found. Reload the map.",
                duration: 1800
              });
          };
          console.log($scope.pos);
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
      //var ref = fbRef;
      var ref = new Firebase("https://buzzmapv0.firebaseio.com/videos");
      //ref.limitToLast(20)
      //requests last 20 videos posted; queried by time posted, not time occured
      ref.orderByChild("t_posted").limitToLast(20).once('value', function(snapshot, key) {
        console.log("firebase value: " + snapshot.val());
        $scope.snapshot = snapshot.val();
        $scope.key = snapshot.key();
        $scope.eventData = $scope.snapshot;
        console.log($scope.eventData);
        console.log(key);

        for (var i = 0; i < $scope.eventData.length; i++) {
          var lat = $scope.eventData[i].Lat;
          var lng = $scope.eventData[i].Lng;
          var latlng = new google.maps.LatLng(lat, lng);
          $scope.lat = lat;
          $scope.lng = lng;
          $scope.latlng = latlng;
          console.log("lat: " + lat + ", lng: " + lng);
          $scope.pin = $sce.trustAsHtml(PinFactory.setPin($scope.eventData[i].cat));
          console.log($scope.eventData[i].cat);
          markers[i] = new MarkerWithLabel({ 
            position: latlng, 
            //title: $scope.eventData[i].title, 
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
                $scope.title = $scope.eventData[i].title;
                $scope.url = $sce.trustAsResourceUrl($scope.eventData[i].url);
                $scope.username = $scope.eventData[i].user;
                $scope.views = $scope.eventData[i].views;
                $scope.desc = $sce.trustAsHtml($scope.eventData[i].description);
                $scope.comments = $scope.eventData[i].comments;
                console.log($scope.comments);
                map.setCenter(markers[i].position);
                map.setZoom(16);
                map.panBy(0, -window.innerHeight/2.1);
                $scope.views++;
                $scope.ups = $scope.eventData[i].ups;
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

      $scope.newData = [];
      ref.on('child_changed', function(snapshot, key) {
        console.log("firebase value: " + snapshot.val());
        $scope.snapshot = snapshot.val();
        $scope.key = snapshot.key();
        $scope.newData.push($scope.snapshot);
        console.log($scope.newData);
        console.log(key);

        for (var i = 0; i < $scope.newData.length; i++) {
          var lat = $scope.newData[i].Lat;
          var lng = $scope.newData[i].Lng;
          var latlng = new google.maps.LatLng(lat, lng);
          $scope.lat = lat;
          $scope.lng = lng;
          $scope.latlng = latlng;
          console.log("lat: " + lat + ", lng: " + lng);
          $scope.pin = $sce.trustAsHtml(PinFactory.setPin($scope.newData[i].cat));
          console.log($scope.newData[i].cat);
          markers[i] = new MarkerWithLabel({ 
            position: latlng, 
            //title: $scope.newData[i].title, 
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
                $scope.title = $scope.newData[i].title;
                $scope.url = $sce.trustAsResourceUrl($scope.newData[i].url);
                $scope.username = $scope.newData[i].user;
                $scope.views = $scope.newData[i].views;
                $scope.desc = $sce.trustAsHtml($scope.newData[i].description);
                $scope.comments = $scope.newData[i].comments;
                console.log($scope.comments);
                map.setCenter(markers[i].position);
                map.setZoom(16);
                map.panBy(0, -window.innerHeight/2.1);
                $scope.views++;
                $scope.ups = $scope.newData[i].ups;
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
  }
  //}); //ionic.Platform.ready
}]);