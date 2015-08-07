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
var app = angular.module('buzzmap', ['ionic', 'ngCordova', 'firebase', 'ngMap', 'yaru22.angular-timeago', 'buzzmap.services'])
.constant('appName', 'BUZZMAP')
.constant('fb_rt', 'https://buzzmapv0.firebaseio.com/')
.factory('fb_factory', function($firebase, fb_rt) {
  return {
    getAuthData: function(key) {
      return new Firebase(fb_rt + '/' + key);
    },
    getVidData: function() {
      return new Firebase(fb_rt + '/videos');
    },
    getUserData: function() {
      return new Firebase(fb_rt + '/users');
    },
    getAllData: function() {
      return new Firebase(fb_rt);
    }
  }
})
.run(function($ionicPlatform, $rootScope, $firebaseAuth, $ionicLoading, $window, $timeout, $ionicHistory) {
  $ionicPlatform.ready(function() {
    document.addEventListener("offline", function() {
        alert("$#!+, you have a bad internet connection!");
    });
    if(window.navigator && window.navigator.splashscreen) {
      $timeout(function() {
        window.navigator.splashscreen.hide();
      }, 5000);
    }
  });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    var deviceInformation = ionic.Platform.device();

    var isWebView = ionic.Platform.isWebView();
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var isWindowsPhone = ionic.Platform.isWindowsPhone();
    /**
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    **/
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };
 
    $rootScope.hide = function() {
      $ionicLoading.hide();
    };
 
    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };
 
    $rootScope.logout = function() {
      $rootScope.auth.$logout();
      $rootScope.checkSession();
    };
 
    $rootScope.checkSession = function() {
      var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        if (error) {
          // no action yet.. redirect to default route
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        } else if (user) {
          // user authenticated with Firebase
          $rootScope.userEmail = user.email;
          $scope.snap();
        } else {
          // user is logged out
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        }
      });
    }
    $rootScope.goBack = function(){
      $ionicHistory.goBack();
    } 
})         

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

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
          controller: 'MapGeolocationCtrl'
        }
      }
    })

    .state('upload', {
      url: "/upload",
      templateUrl: "templates/upload.html",
      controller: 'UploadCtrl'
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
  $urlRouterProvider.otherwise('/app/map');
});
