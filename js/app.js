// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
/**
document.addEventListener('deviceready', function() { 
  angular.bootstrap(document, ['app']);
  var deviceProperties = {
                      'Device Model': device.model,
                      'Device Cordova': device.cordova,
                      'Device Platform': device.platform,
                      'Device UUID': device.uuid,
                      'Device Version': device.version,
                      'Device Name': device.name
                    };
                    alert(deviceProperties);
});

var deviceProperties = [];
    deviceProperties = {
                        'Device Model': device.model,
                        'Device Cordova': device.cordova,
                        'Device Platform': device.platform,
                        'Device UUID': device.uuid,
                        'Device Version': device.version,
                        'Device Name': device.name
                      }
  var deviceProperties = document.getElementById('deviceProperties');
    element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
                        'Device Cordova: '  + device.cordova  + '<br />' +
                        'Device Platform: ' + device.platform + '<br />' +
                        'Device UUID: '     + device.uuid     + '<br />' +
                        'Device Version: '  + device.version  + '<br />' +
                        'Device Name: '  + device.name  + '<br />';
  **/
var app = angular.module('buzzmap', ['ionic', 'ngCordova', 'firebase', 'ngMap', 'yaru22.angular-timeago', 'buzzmap.services', 'UploadMod'])
.constant('appName', 'BUZZMAP')
.run(function($ionicPlatform, $rootScope, $firebaseAuth, $ionicLoading, $window, $timeout, $ionicHistory) {
  $ionicPlatform.ready(function() {
    document.addEventListener("offline", function() {
        alert("You have a $#!++/ internet connection...");
    });

    window.navigator.splashscreen.show();

    if (parseFloat(window.device.version) >= 7.0) {
      document.body.style.marginTop = "20px";
    }

    if(window.navigator && window.navigator.splashscreen) {
      $timeout(function() {
        navigator.splashscreen.hide();
      }, 5000);
    }

  });

  function onDeviceReady() {
    document.addEventListener("offline", function() {
        alert("$#!+, you have a bad internet connection!");
    });
    window.navigator.splashscreen.hide();
    console.log('onDeviceReady');
    if (parseFloat(window.device.version) >= 7.0) {
          document.body.style.marginTop = "20px";
    }
  }
    
  document.addEventListener('deviceready', onDeviceReady, false);

  var deviceInformation = ionic.Platform.device();
  var isWebView = ionic.Platform.isWebView();
  var isIPad = ionic.Platform.isIPad();
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
  var isWindowsPhone = ionic.Platform.isWindowsPhone();
  
  if(window.cordova && window.cordova.plugins.Keyboard) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(false);
  }
  
  if(window.StatusBar) {
    // org.apache.cordova.statusbar required
    StatusBar.styleDefault();
  }

  if(ionic.Platform) {
    //ionic.Platform.fullScreen();
    //screen.orientation.lock('portrait-primary');
  }

})         

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('welcome', {
      url: "/welcome",
      templateUrl: "templates/welcome.html",
      controller: 'AppCtrl'
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.map', {
      url: "/map",
      views: {
        'menuContent' :{
          templateUrl: "templates/map.html",
          controller: 'MapGeolocationCtrl',
          authRequired: true
        }
      }
    })

    .state('upload', {
      url: "/upload",
      templateUrl: "templates/upload.html",
      //controller: 'UploadCtrl',
      authRequired: true
    })


    .state('app.account', {
      url: "/account",
      views: {
        'menuContent' :{
          templateUrl: "templates/account.html",
          controller: 'PlaylistsCtrl',
          authRequired: true
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/map');
});
