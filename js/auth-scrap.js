.controller('UploadCtrl', function($scope, $cordovaGeolocation, map_style, $cordovaCamera, PinFactory, $ionicScrollDelegate, $state, $cordovaProgress, $cordovaKeyboard, $cordovaFileTransfer, $ionicHistory, $ionicLoading, fbUrl, SynchFactory) {
  var map, lat, lng;
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
        map.setCenter($scope.pos);

        $scope.home = function() {
          map.setCenter($scope.pos);
        }
        
        $scope.$watch(function(){ 
          marker1 = new MarkerWithLabel({
            map: map,
            icon: '',
            labelContent: $scope.chosenPin,
            labelAnchor: new google.maps.Point(20, 40),
            labelClass: "labels", // the CSS class for the label
            labelInBackground: false,
            labelStyle: {opacity: 1.0}
          });
          marker1.bindTo('position', map, 'center');
        });  
        var center = map.getCenter();
        lat = center.lat();
        lng = center.lng();
      }); 
    }
    return map, lat, lng;
  });

          console.log(map, lat, lng);   

  $scope.pins = PinFactory.allPins();
  var pinKeys = Object.keys($scope.pins);
  
  var pins = Object.keys($scope.pins);

  var vidCat = "awesome";

  $scope.chosenPin = $scope.pins[vidCat];
  
  var index, key, marker1;

  $scope.choosePin = function() {

    index = this['$index'];// get integer 
    key = pinKeys[index];//get category's name from array
    $scope.chosenPin = $scope.pins[key];//change pin
    vidCat = key;//set video category
    console.log(index, key, $scope.chosenPin);     
  
  }
 
  $scope.cancel = function() {
    $state.go('app.map');

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $ionicHistory.clearHistory();

    $ionicLoading.show({
      template: 'Post cancelled',
      noBackdrop: true,
      duration: 1500
    });   
    
  }
  //cordova.plugins.Keyboard.disableScroll(true);
  //window.addEventListener('native.keyboardshow', keyboardShowHandler);

  function keyboardShowHandler(e){
    $ionicScrollDelegate.scrollTop();
    console.log('Keyboard height is: ' + e.keyboardHeight);
  }
              
  document.getElementById("file_input").onchange = function() {
    console.log("file_input");
    $state.go('upload');
    var files = document.getElementById("file_input").files;
    var file = files[0];
    if (file) SynchFactory.uploadVideo(file);

  };
    
  

  var onComplete = function(error, vidUrl) {
    if (error) {
        console.log('Synchronization failed');
        $ionicPopup.alert({'templete': 'Synchronization failed'});
    } else {
      upload++;
      $ionicLoading.show({
        template: 'Successful post!',
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
  var ref = new Firebase(fbUrl + 'videos');
  ref.on('value', function(snapshot, event) {
      console.log(snapshot.val());
      angular.element(document.querySelector('#upload')).bind('submit', function() {
        console.log(snapshot.val());
        var vidNumber = snapshot.val().length ++;
        var lat = center.lat();
        var lng = center.lng();
        var vidTitle = $scope.upload_title;
        var vidDescription = $scope.upload_description;
        var vidTags = $scope.upload_description.match(/(^|\s)(#[a-z\d-]+)/ig);
        var vidUser = $scope.authDisplay;
        var vidUrl = data.Location;
        var t_occ = $scope.when;
        var t_posted = Date.now();
        $scope.vid_description = document.getElementById('upload_description').value;
        $scope.vid_description = $scope.upload_description;
        $scope.vidTags = $scope.upload_description.match(/(^|\s)(#[a-z\d-]+)/ig);   
        $scope.vidDesc = $scope.upload_description.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $scope.when = document.getElementById('upload_when').value;

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
      
});