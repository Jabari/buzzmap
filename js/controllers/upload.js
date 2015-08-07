'use strict';
angular.module('AppCtrl', ['ngMap', 'ngCordova'])
app.controller('UploadCtrl', ['$scope', '$cordovaGeolocation', '$timeout', '$sce', '$ionicHistory', 'PinFactory', 'map_style', '$ionicPopup', '$cordovaFileTransfer', '$state', function($scope, $cordovaGeolocation, $timeout, $sce, $ionicHistory, PinFactory, map_style, $ionicPopup, $cordovaFileTransfer, $state){
  $scope.$on('mapInitialized', function(event, map) {
    var mapStyle = map_style.style1();
    map.setOptions({styles: mapStyle, zoom: 15, minZoom: 12, keyboardShortcuts: false}); 
    
    if(navigator.geolocation) {
      var posOptions = {
        timeout: 8000, 
        enableHighAccuracy: true, //coarse location resolves faster than fine
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

   
        //endpoint - bm-vids.s3-website-us-west-1.amazonaws.com
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = "AKIAJFG7B7NV4RSY23DA";
    AWS.config.secretAccessKey = "u5jY5rsITYLDfOdq09LY9TmYD3hPUzWBsZYUG0Zc";
    // Configure your region
    //AWS.config.region = 'us-west-1';

    console.log($cordovaFileTransfer);
    var bucket = new AWS.S3({params: {Bucket: 'bm-vids'}});

    //var fileChooser = document.getElementById('file-chooser');
    var button = document.getElementById('upload-button');
    var filePicker = document.getElementById('filePicker');
    var results = document.getElementById('results');
    
    filePicker.addEventListener('change', function(event) {
    //function uploadfile() {
      console.log('uploadfile called');
      var file = filePicker.files[0];
      //var fileData = event.target.files[0];
      var filename = file.name + Date.now();
      if (file) {
        results.innerHTML = '';
        var params = {
          Key: filename, 
          ContentType: file.type, 
          Body: file
        };
        bucket.upload(params, function (err, data) {
          results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
          console.log("err: " + err);
          console.dir(data);
          console.log(data.Location);
          document.getElementById('upload_url').value = data.Location;
          console.log(params);
        });
      } else {
        results.innerHTML = 'Nothing to upload.';
      }
    }, false);
    $scope.uploadFile = function() {
      console.log('uploadfile called');
      var file = filePicker.files[0];
      var filename = file.name + Date.now();
      var url = "https://bm-vids.s3-website-us-west-1.amazonaws.com";
       //target path may be local or url
      var targetPath = cordova.file.externalRootDirectory + filename;
      var options = {
          fileKey: filename,
          fileName: filename,
          chunkedMode: false,
          mimeType: file.type
      };
      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
          console.log("SUCCESS: " + JSON.stringify(result.response));
          alert("success");
          alert(JSON.stringify(result.response));
      }, function(err) {
          console.log("ERROR: " + JSON.stringify(err));
          alert(JSON.stringify(err));
      }, function (progress) {
          // constant progress updates
          $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        })
      });
    }
    //mediaFile.getFormatData();
    /**
    var contentType = fileData.type || 'application/octet-stream';
        var filename = fileData.name + Date.now() + Math.round(Math.random() * 1000);
        var metadata = {
          'name': filename,
          'mimeType': contentType,
          'acl': 'public-read'
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          base64Data +
          close_delim;
    
    }
    **/      
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
      $scope.description = document.getElementById('upload_description').value;
      $scope.vidTags = $scope.description.match(/(^|\s)(#[a-z\d-]+)/ig);   
      $scope.desc = $scope.description.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
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
    
    ref.on('value', function(snapshot, event) {
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
    //$cordovaToast.show('Your current location', 'short', 'center');
    //navigator.notification('Your current location');
    
    var awesome = '<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>';
    var music = '<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>';
    var fire = '<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>';
    var love = '<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>';
    var party = '<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>';
    var green = '<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>';
    var dialog = '<i class="icon-Geo2 pin dialog"><i class="icon-Spebach-BubbleDialog symbol"></i></i>';
    var animals = '<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>';
    var medical = '<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>';
    var vehicle = '<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>';
    var sports = '<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>';
    var art = '<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>';
    var whoa = '<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>';
    var police = '<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>';
    var hero = '<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>';
    /**
    $scope.getMapCoords = function() {
      map.getCenter();
      return google.maps.LatLng.lat();
    };
    
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

    angular.element(document.querySelectorAll('.pin')).on('click', function(event) {
      var pin = this.classList;
      marker1.setMap(null);
      marker1 = null;
      if (pin.contains('awesome')) {
        $scope.chosenPin = awesome;
      } else if (pin.contains('music')) {
        $scope.chosenPin = music;
      } else if (pin.contains('fire')) {
        $scope.chosenPin = fire;
      } else if (pin.contains('love')) {
        $scope.chosenPin = love;
      } else if (pin.contains('party')) {
        $scope.chosenPin = party;
      } else if (pin.contains('green')) {
          $scope.chosenPin = green;
      } else if (pin.contains('dialog')) {
          $scope.chosenPin = dialog;
      } else if (pin.contains('animals')) {
        $scope.chosenPin = animals;
      } else if (pin.contains('medical')) {
        $scope.chosenPin = medical;
      } else if (pin.contains('vehicle')) {
        $scope.chosenPin = vehicle;
      } else if (pin.contains('sports')) {
        $scope.chosenPin = sports;
      } else if (pin.contains('art')) {
          $scope.chosenPin = art;
      } else if (pin.contains('whoa')) {
          $scope.chosenPin = whoa;
      } else if (pin.contains('police')) {
          $scope.chosenPin = police;
      } else {
          $scope.chosenPin = hero;
      } 

      marker1 = new MarkerWithLabel({
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
      vidCat = pin[2];
    });
    
    **/
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