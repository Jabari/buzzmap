'use strict';
angular.module('buzzmap.controllers', ['ionic', 'firebase', 'ngCordova'])
app.controller('AppCtrl', ['$scope', '$ionicModal', '$firebaseAuth', '$timeout', '$rootScope', '$cordovaToast', '$ionicPopup', '$ionicLoading', '$state', 'fbRef', function($scope, $ionicModal, $firebaseAuth, $timeout, $rootScope, $cordovaToast, $ionicPopup, $ionicLoading, $state, fbRef) {
  
  $ionicLoading.show({
    template: 'Loading events...'
  });

  $scope.resetIcon = false;

  $scope.reset = function() {
    location.href = location.origin;
    $scope.resetIcon = !$scope.resetIcon;
  }

  var ref = fbRef;
  
  var auth = $firebaseAuth(ref);
  
  //Register the callback to be fired every time auth state changes
  ref.onAuth(authDataCallback);

  $scope.signupData = {};
  
  if ((window.localStorage.getItem("username") === null && window.localStorage.getItem("password") === null) || (window.localStorage.getItem("username") === "undefined" && window.localStorage.getItem("password") === "undefined"))
  {
    $state.go('welcome');
  } 
  if (window.localStorage.getItem("username") !== null && window.localStorage.getItem("password") !== null && window.localStorage.getItem("username") !== "undefined" && window.localStorage.getItem("password") !== "undefined")
  {
    $state.go('app.map');
  }

  //screen.orientation.lock('portrait-primary');
  //window.screen.orientation.lock('portrait-primary');
  console.log(screen.orientation);
  window.addEventListener("orientationchange", function(){
    console.log('Orientation changed to ' + screen.orientation);
  });
  screen.orientation.lock('portrait-primary').catch(function() {
    console.log('Device not compatible with screen lock');
  });
  // Create the signup modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    id: "signup",
    scope: $scope,
    backdropClickToClose: true,
    hardwareBackButtonClose: true,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.signupModal = modal;
  });

  // Open the signup modal
  $scope.signup = function() {
    $scope.signupModal.show();
  };

  // Triggered in the signup modal to close it
  $scope.closeSignup = function() {
    $scope.signupModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.signupModal.remove();
  });
  
  $scope.signup.$invalid = function() {
    return this.form.$invalid;
  };
  // This callback logs the current auth state
  function authDataCallback(authData) {
    if (authData) {
      console.log(authData);
      if (authData.password !== undefined) {
        var username = authData.password.email.split('@', 1);
      } else {
        var username = authData.password;
      }
      console.log("User #" + authData.uid + ", " + username + " is logged in");
      $scope.authDisplay = username.toString();
      window.username = $scope.authDisplay;
      var user = $scope.authDisplay;
      $scope.isLoggedIn = true;
      $state.go('app.map');
    }
  }

  // Perform the signup action when the user submits the signup form
  $scope.doSignup = function() {
    
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
    
    if ($scope.signupData.password === $scope.signupData.re_password) {
      console.log('Doing signup', $scope.signupData);
      var username = $scope.signupData.username + '@gmail.com';
      auth.$createUser({
        email: username,
        password: $scope.signupData.password
      }).then(function(userData) {
        $scope.closeSignup();
        $ionicLoading.show({
          template: "Now, show the World what's going on.",
          duration: 3000
        })
        console.log("new user created " + "# " + userData.uid + ", " + username);
        window.localStorage.setItem("username", $scope.username);
        window.localStorage.setItem("password", authData.password.password);
        window.localStorage.setItem('userStage', 'regUser');
        //log user in
        auth.$authWithPassword({
          email: username,
          password: $scope.signupData.password
        }).then(function(authData) {
          console.log("Logged in as:", "# " + authData.uid + ", " + username);
          reset();
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });

      }).catch(function(error) {
        console.log(error + error.code);
        if (error.code === 'EMAIL_TAKEN') {
          $ionicLoading.show({
            template: "Sorry, you're not the first " + $scope.signupData.username + ". Choose another name.",
            duration: 3000
          })
        }
      });                 
    } else {
      $ionicLoading.show({
        template: "Your passwords don't match. Enter them again.",
        duration: 3000
      })
    }
  }
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    id: "login",
    scope: $scope,
    backdropClickToClose: true,
    hardwareBackButtonClose: true,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.login.$invalid = function() {
    return this.form.$invalid;
  }

  $scope.isFormDisabled = function() {
    return this.form.$invalid;
  }
  
  $scope.anonLogin = function(){
    auth.$authAnonymously().then(function(authData) {
      $scope.authData = authData;
    }).catch(function(error) {
      $scope.error = error;
    });
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(username, password) {
    console.log('Doing login', $scope.loginData);
    console.log(username);
    console.log(password);
    username = $scope.loginData.username + '@gmail.com';
    password = $scope.loginData.password;

    auth.$authWithPassword({
        email: username,
        password: password
      }).then(function(authData) {
        $scope.closeLogin();
        $ionicLoading.show({
          template: "Now, show the World what's going on.",
          duration: 3000
        }); 
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("password");
        window.localStorage.setItem("username", username);
        window.localStorage.setItem("password", password);
        console.log("Logged in as:", "#" + $scope.loginData.username);
        reset();
      }).catch(function(error) {
        console.error("Authentication failed:", error);
        $ionicLoading.show({
          template: 'You entered the wrong stuff. Please try again.',
          noBackdrop: true,
          duration: 3000
        })
      });
      // Register the callback to be fired every time auth state changes
    ref.onAuth(authDataCallback);
  }

  $scope.logout = function() {
    window.localStorage.clear();
    console.log("User is logged out");
    $ionicLoading.show({
        template: "You're logged out",
        duration: 2500
      });   
    $state.go('welcome');
  }

}])
/**
.controller('LoadingCtrl', function($scope, $ionicLoading) {
    $scope.show = function() {
      $ionicLoading.show({
        templateUrl: "../templates/loading.html" 
      })
    }
})
**/
.controller('PinCtrl', ['$scope', 'PinFactory', '$sce', 'map_style', '$cordovaGeolocation', function($scope, PinFactory, $sce, map_style, $cordovaGeolocation) {
  //var pins = PinFactory.allPins();
  //console.log(pins); //object
  //$scope.pins = $sce.trustAsHtml(PinFactory.allPins());
  $scope.pins = PinFactory.allPins();
  console.log($scope.pins); //[]
  console.log(Object.keys($scope.pins)); 
  //["awesome", "music", "fire", "love", "party", "green", "dialog", "animals", "medical", "vehicle", "sports", "art", "whoa", "police", "hero"]
  for(var key in $scope.pins) {
    var pin = $scope.pins[key];
    console.log(pin);
  }
  //<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>
  console.log(Object.keys($scope.pins).length); //15

  $scope.showPins = false;

  $scope.togglePin = function(pin) {
    if ($scope.isPinShown(pin)) {
      $scope.shownPin = null;
    } else {
      $scope.shownPin = pin;
    }
  };

  $scope.isPinShown = function(pin) {
    return $scope.shownPin === pin;
  };

  $scope.pinDisabled = false;

  $scope.disabledPins = [];

  $scope.disablePin = function(index, $event) {
    $scope.disabledPins[index] = $scope.disabledPins[index] == 'disabled' ? '' : 'disabled';
    $event.stopPropagation();
  }

}])

.controller('WelcomeCtrl', function($scope, $ionicSlideBoxDelegate, $ionicHistory, $ionicLoading, $ionicPopup) {
  $ionicLoading.hide();
  //$ionicPopup.close();
  $ionicHistory.clearHistory();

  $scope.navSlide = function($index) {
    $ionicSlideBoxDelegate.slide($index, 500);
  }
  //$scope.welcome = "Sign up";
  $scope.slideHasChanged = function() {
    if ($ionicSlideBoxDelegate.currentIndex() === 0) {
      $scope.welcome = "Sign up";
    } else {
      $scope.welcome = "Log in";
    }
  }
})

.controller('searchCtrl', function($scope) {
  $scope.search = "#";
  $scope.search_map = function() {
    $location.path('#g');
  }
})
angular.module('UploadMod', ['ngMap'])
.controller('UploadCtrl', function($scope, $cordovaGeolocation, map_style, $cordovaCamera, PinFactory, $ionicScrollDelegate, $state, $cordovaProgress, $cordovaKeyboard, $cordovaFileTransfer, $ionicHistory, $ionicLoading, SynchFactory) {
  $scope.$on('mapInitialized', function(event, map) {
    var mapStyle = map_style.style1();
    map.setOptions({styles: mapStyle, zoom: 15, minZoom: 12, keyboardShortcuts: false}); 
    //var center, map, lat, lng;
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
        $scope.map = map;

        $scope.$watch(function(){ 
          
          marker1 = new MarkerWithLabel({
            draggable: false,
            icon: ' ',
            labelContent: $scope.chosenPin,
            labelAnchor: new google.maps.Point(20, 40),
            labelClass: "labels", // the CSS class for the label
            labelInBackground: false,
            labelStyle: {opacity: 1.0},
            map: map,
          });
          marker1.bindTo('position', map, 'center');

        });  
      }); 
    }

    //var center = new Object;
    $scope.uploadVid = function () {
      //console.log('uploadVid');
      var vidMeta = new Object;
      vidMeta.vidCat = vidCat;
      vidMeta.center = map.getCenter();
      console.log(vidMeta.center);
      var int = 0;
      var center = [];
      //Google Maps changes key names w/o warning so this should figure it out
      for (var key in vidMeta.center) {
        center[int] = vidMeta.center[key];
        int++;
      }
      vidMeta.lat = center[0];
      vidMeta.lng = center[1];
      vidMeta.vidTitle = $scope.upload_title;
      if ($scope.upload_description) {
        vidMeta.vidDescription = $scope.upload_description.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        vidMeta.vidTags = $scope.upload_description.match(/(^|\s)(#[a-z\d-]+)/ig);
      } else {
        vidMeta.vidDescription = "hmmm..."
        vidMeta.vidTags = {};
      }
      vidMeta.vidUser = username;
      vidMeta.vidUrl = vidUrl;
      if ($scope.when) {
        vidMeta.t_occ = $scope.when;
      } else {
        vidMeta.t_occ = Date.now();
      }
      vidMeta.t_posted = Date.now();
      console.log(vidMeta);
      SynchFactory.fbVidSync(vidMeta);
    } //uploadVid
  }); //mapInitialized
  document.getElementById("file_input").onchange = function() { 
      console.log("file_input");
      $state.go('upload');
      var files = document.getElementById("file_input").files;
      var file = files[0];
      
      if (file) {
        var filename = Date.now() + file.name;
        $scope.when = file.lastModified;
        $scope.url = "https://s3-us-west-2.amazonaws.com/bm-vids-test/" + filename;
        window.vidUrl = $scope.url;
        //document.getElementById('upload_url').value = $scope.url;
        console.log("file: ", file)
        console.log("url: ", $scope.url);
        SynchFactory.uploadVideo(file, filename);
      }
    };

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
      reset();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });  

      $ionicLoading.show({
        template: 'Post cancelled',
        noBackdrop: true,
        duration: 2000
      });      
    }
    //cordova.plugins.Keyboard.disableScroll(true);
    //window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e){
      $ionicScrollDelegate.scrollTop();
      console.log('Keyboard height is: ' + e.keyboardHeight);
    }
    
  
})


