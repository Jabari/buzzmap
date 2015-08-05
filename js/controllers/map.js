'use strict';
angular.module('AppCtrl', ['ngMap'])

app.controller('MapGeolocationCtrl', function($scope, $timeout, $ionicModal) {
  ionic.Platform.ready(function() {
    $scope.$on('mapInitialized', function(event, map) {
      console.log("hello from map.js");
      if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        var pulse = document.createElement('div');
        pulse.classList.add = "pulse";

        var userLoc = {
          fillColor: 'gold',
          path: 'M -2,0 0,-2 2,0 0,2 z',
          fillOpacity: 0.8,
          scale: 3
        };

        var marker = new google.maps.Marker({
          position: $scope.pos,
          icon: userLoc,
          map: map
        });

        var infowindow = new google.maps.InfoWindow({
          map: map,
          position: $scope.pos,
          content: 'Your location'
        });
        map.setCenter($scope.pos);
        //remove top header from map screen
        var removeMapHeader = document.getElementById("map");
        removeMapHeader.classList.remove("has-header");




        // "BuzzMap v0.1" @ snazzymaps.com
        var mapStyle = [{"featureType":"administrative.country","elementType":"labels","stylers":[{"gamma":".5"}]},{"featureType":"administrative.province","elementType":"labels","stylers":[{"gamma":".5"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"gamma":".65"},{"saturation":"0"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"weight":"3.00"},{"saturation":"0"},{"gamma":"0.6"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":"40"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":"20"},{"saturation":"0"},{"gamma":"2.00"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":"10"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"weight":"1.00"},{"lightness":"25"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway.controlled_access","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}];
        map.setOptions({styles: mapStyle, zoom: 12, maxZoom: 16, minZoom: 5, keyboardShortcuts: false});    
      },
      function() {
        handleNoGeolocation(true);
      });

      $scope.touchDisplay = console.log(false + "touchDisplay");

      $scope.home = function() {
        map.setCenter($scope.pos);
      }

      //modal
      $ionicModal.fromTemplateUrl('modal-video.html', {
      id: '1', // We need to use an ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: true,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    $scope.openModal = function(index) {
      $scope.oModal1.show();
    };
    
    $scope.closeModal = function(index) {
      $scope.oModal1.hide();
    };

    /* Listen for broadcasted messages */
    
    $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' is shown!');
    });
    
    $scope.$on('modal.hidden', function(event, modal) {
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

      if ($scope.toggleSearch === true) 
        document.getElementById('search_map').focus();
      else
        console.log($scope.searchMap);

      console.log("toggle");
      
    };
    
    //function()  
      
    var searchMap = (document.getElementById('search_map'));


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

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

      

      //end map search
      var markers = [];
      $scope.dynMarkers = [];
        for (var i = 0; i < 8; i++) {
          $timeout(function() {
          markers[i] = new google.maps.Marker({ title: "Marker: " + i });
            var lat = 37.7749 + (Math.random() / 100);
            var lng = -122.4194 + (Math.random() / 100);
            var loc = new google.maps.LatLng(lat, lng);
            markers[i].setPosition(loc);
            markers[i].setAnimation(google.maps.Animation.Drop);
            markers[i].setMap(map);
            console.log(lat + lng);
          }, i * 1500);
          };
          $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
      } else {
        $scope.pos = new google.maps.LatLng(37.7749, -122.4194);
        handleNoGeolocation(false);
        alert(Location_err);
      }
      onGesture(release, $scope.showNavTools, 'map');

      var setMapHeight = function() {
        //A hack to set map at device screen height
        //I'm not sure if still needed
        map.setAttribute( "style", "height:" + window.innerHeight + "px;" );
      }
      
      
    });
  });
});


app.controller('markerCtrl', ['$scope', function($scope) {
  function GeolocationMarker(opt_map, opt_markerOpts, opt_circleOpts) {

  var markerOpts = {
    'clickable': true,
    'cursor': 'pointer',
    'draggable': false,
    'flat': false,
    'icon': {
        'url': 'https://google-maps-utility-library-v3.googlecode.com/svn/trunk/geolocationmarker/images/gpsloc.png',
        'size': new google.maps.Size(34, 34),
        'scaledSize': new google.maps.Size(17, 17),
        'origin': new google.maps.Point(0, 0),
        'anchor': new google.maps.Point(8, 8)
    },
    // This marker may move frequently - don't force canvas tile redraw
    'optimized': false, 
    'position': new google.maps.LatLng(0, 0),
    'title': 'Current location',
    'zIndex': 2
  };

  if(opt_markerOpts) {
    markerOpts = this.copyOptions_(markerOpts, opt_markerOpts);
  }

  var circleOpts = {
    'clickable': false,
    'radius': 0,
    'strokeColor': '1bb6ff',
    'strokeOpacity': .4,
    'fillColor': '61a0bf',
    'fillOpacity': .4,
    'strokeWeight': 1,
    'zIndex': 1
  };

  if(opt_circleOpts) {
    circleOpts = this.copyOptions_(circleOpts, opt_circleOpts);
  }

  this.marker_ = new google.maps.Marker(markerOpts);
  this.circle_ = new google.maps.Circle(circleOpts);

  /**
   * @expose
   * @type {number?}
   */
  this.accuracy = null;

  /**
   * @expose
   * @type {google.maps.LatLng?}
   */
  this.position = null;

  /**
   * @expose
   * @type {google.maps.Map?}
   */
  this.map = null;
  
  this.set('minimum_accuracy', null);
  
  this.set('position_options', /** GeolocationPositionOptions */
      ({enableHighAccuracy: true, maximumAge: 1000}));

  this.circle_.bindTo('map', this.marker_);

  if(opt_map) {
    this.setMap(opt_map);
  }
}

  
}]);