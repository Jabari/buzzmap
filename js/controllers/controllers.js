'use strict';
angular.module('buzzmap.controllers', ['ionic', 'firebase', 'ngCordova'])
app.controller('AppCtrl', ['$scope', '$ionicModal', '$firebaseAuth', '$timeout', '$rootScope', '$cordovaToast', '$ionicPopup', 'fb_rt', 'fb_factory', '$ionicLoading', function($scope, $ionicModal, $firebaseAuth, $timeout, $rootScope, $cordovaToast, $ionicPopup, fb_rt, fb_factory, $ionicLoading) {
  $ionicLoading.show({
        template: 'Finding events...'
  });
  var ref = new Firebase(fb_rt + 'users');
  var auth = $firebaseAuth(ref);
  // Register the callback to be fired every time auth state changes
  ref.onAuth(authDataCallback);

  $scope.signupData = {};
  
  //screen.lockOrientation('portrait');
  console.log(screen.orientation);
  window.addEventListener("orientationchange", function(){
    console.log('Orientation changed to ' + screen.orientation);
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
  }
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
      $scope.isLoggedIn = true;
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
        $ionicPopup.alert({
          title: '$#!+ yeah!',
          template: 'You&#39;re all signed up.'});
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
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });

      }).catch(function(error) {
        console.log(error + error.code);
      });                 
    } else {
      showAlert({
        'title': 'You made a mistake',
        'detail': 'Please re-type your password'
      });
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
    if (username === undefined && password === undefined) {
      var username = $scope.loginData.username + '@gmail.com';
      var password = $scope.loginData.password;
    }

    auth.$authWithPassword({
        email: username,
        password: password
      }).then(function(authData) {
        $scope.closeLogin();
        $ionicPopup.alert({
          title: '$#!+ yeah!',
          template: 'You&#39;re logged in and ready to go.'
        });
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("password");
        window.localStorage.setItem("username", $scope.username);
        window.localStorage.setItem("password", authData.password.password);
        console.log("Logged in as:", "#" + authData.uid + ", " + username);
        console.log("regUser returns");
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
      // Register the callback to be fired every time auth state changes
    ref.onAuth(authDataCallback);
  }

  $scope.logout = function() {
    alert('You&#39;re logged out');
    window.localStorage.clear();
    console.log("User is logged out");
    $ionicPopup.alert({template: 'Logged out.'});
  }

  ionic.Platform.ready(function() {
    console.log("controller.js is working");
    //logs user as anon user if no credentials exist on device, else log em in
    if(window.localStorage.getItem("username") === null && window.localStorage.getItem("password") === null) {
        window.localStorage.setItem('userStage', 'anonUser');
        //$scope.anonLogin(); //is already fired automatically      
    } else {
        var username = window.localStorage.getItem("username");
        var password = window.localStorage.getItem("password");
        $scope.doLogin(username, password);
    }
  });
  
}])
.controller('LoadingCtrl', function($scope, $ionicLoading) {
    $scope.show = function() {
      $ionicLoading.show({
        templateUrl: "../templates/loading.html" 
      })
    }
})

.controller('PinCtrl', ['$scope', 'PinFactory', '$sce', function($scope, PinFactory, $sce) {
  var pins = PinFactory.allPins();
  //$scope.pins = $sce.trustAsHtml(PinFactory.allPins());
  $scope.pins = [];
  console.log(pins); //object
  console.log($scope.pins); //[]
  console.log(Object.keys(pins)); 
  //["awesome", "music", "fire", "love", "party", "green", "dialog", "animals", "medical", "vehicle", "sports", "art", "whoa", "police", "hero"]
  console.log(Object.keys(pins).length); //15

  
  var count = 0;
  for (var key in pins) {
    var pin = pins[key];
    $scope.pins.push(pin);
  }
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
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('searchCtrl', function($scope) {
  $scope.search = "#";
  $scope.search_map = function() {
    $location.path('#g');
  }
})



