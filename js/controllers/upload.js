'use strict';
angular.module('AppCtrl', ['ngMap', 'ngCordova'])
app.controller('UploadCtrl', ['$scope', '$cordovaGeolocation', '$timeout', '$sce', '$ionicHistory', 'PinFactory', 'map_style', '$ionicPopup', '$cordovaFileTransfer', '$state', function($scope, $cordovaGeolocation, $timeout, $sce, $ionicHistory, PinFactory, map_style, $ionicPopup, $cordovaFileTransfer, $state){
  $scope.$on('mapInitialized', function(event, map) {
    var mapStyle = map_style.style1();
    map.setOptions({styles: mapStyle, zoom: 15, minZoom: 12, keyboardShortcuts: false}); 
    
    if(navigator.geolocation) {
      var posOptions = {
        timeout: 8000, 
        enableHighAccuracy: true, 
        maximumAge : 0
      };

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
        
        $scope.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var lat = new google.maps.LatLng(position.coords.latitude);
        var lng = new google.maps.LatLng(position.coords.longitude);
        map.setCenter($scope.pos);
        console.log("long: " + lng + "; lat: " +lat);

        $scope.home = function() {
          map.setCenter($scope.pos);
        }

      }); 
    }
   
    var onComplete = function(error, vidUrl) {
      if (error) {
          console.log('Synchronization failed');
          $ionicPopup.alert({'templete': 'Synchronization failed'});
      } else {
        upload++;
        $ionicLoading.show({
          template: 'Video posted!',
          noBackdrop: true,
          duration: 2000
        });
        console.log('Upload & Synchronization succeeded' + upload);
        console.log(vidUrl);
        //document.getElementById('button-bg').style.top = "0px";
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.map');
        $ionicHistory.clearHistory();
      }
    }
//targetScope: ChildScope, defaultPrevented: false, currentScope: Object
//targetScope: Object, defaultPrevented: false, currentScope: Object
    
    $scope.$watch(function(){ 
      $scope.vidTags = $scope.upload_description.match(/(^|\s)(#[a-z\d-]+)/ig);   
      $scope.vidDesc = $scope.upload_description.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
      $scope.when = document.getElementById('upload_when').value;
    });
    
    $scope.cancel = function() {
      $state.go('app.map');
      console.log('Upload cancelled');
      $ionicLoading.show({
        template: 'Video post cancelled',
        noBackdrop: true,
        duration: 1500
      });
    }

    //if ($scope.title.$dirty) console.log('dirty');

    $scope.locate = function() {
      //angular.element(querySelector('#button-bg')).css('top', '0px');
      var center = map.getCenter();
      var lat = center.lat();
      var lng = center.lng();
      console.log($scope.vidTags);
      console.log($scope.desc);
      console.log($scope.when);
      console.log(center.lat());
      console.log("long: " + lng + "; lat: " +lat);
    }
    var ref = new Firebase('https://buzzmapv0.firebaseio.com/videos');
    
    ref.on('child_added', function(snapshot, event) {
        console.log(snapshot.val());
        angular.element(document.querySelector('#upload')).bind('submit', function() {
          var vidNumber = snapshot.val().length ++;
          var vidTitle = $scope.title;
          var vidDesc = $scope.desc;
          var vidTags = $scope.vidTags;
          var vidUser = $scope.authDisplay;
          var vidUrl = data.Location;
          var t_occ = $scope.when;
          var t_posted = Date.now();

          ref.child(vidNumber).set({
            Lat: lat,
            Lng: lng,
            t_posted: t_posted,
            t_occ: t_occ,
            title: vidTitle,
            vidid: vidNumber,
            category: vidCat,
            description: vidDesc,
            tags: vidTags,
            url: vidUrl,
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
        });
  });
    
  $scope.chosenPin = awesome;
  var vidCat = "awesome";

  var marker1 = new MarkerWithLabel({
   position: $scope.pos,
   map: map,
   icon: ' ',
   labelContent: $scope.chosenPin,
   labelAnchor: new google.maps.Point(20, 40),
   labelClass: "labels", // the CSS class for the label
   labelInBackground: false,
   labelStyle: {opacity: 0.85}
  });
  marker1.bindTo('position', map, 'center');

  
  Date.prototype.toDateInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON();
  })

    //angular.element(document.querySelector('#id').css("color", "#fff"));
    //$scope.time = new Date().toDateInputValue().slice(0,10);
    //console.log($scope.time);        
  })
}]);