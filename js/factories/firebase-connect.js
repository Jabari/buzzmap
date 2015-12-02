angular.module('AppCtrl', [''])
/**
        app.factory("firebaseConnection", ["$firebase", "$firebaseAuth", "$rootScope", "dburl",
         function ($firebase, $firebaseAuth, $rootScope, dburl) {
            var firebase = new Firebase(firebaseUrl);
            firebase.authWithCustomToken("AUTH_TOKEN", function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			 }
            return $firebase(firebase);
        }])
**/
        app.factory("vid-firebaseConnection",
         function ($firebase, $firebaseAuth, $rootScope, dburl) {
            var firebase = new Firebase(dburl + '/videos');
            return firebase;
            console.log(dburl);
        })
        /**
        app.factory("user-firebaseConnection", ["$firebase", "$firebaseAuth", "$rootScope", "dburl",
         function ($firebase, $firebaseAuth, $rootScope, dburl) {
            var firebase = new Firebase(firebaseUrl + '/users');
            return $firebase(firebase);
        }])
        app.factory('fb_Factory', function($firebase, fbUrl) {
          return {
            getData: function(key) {
              return $firebase(new Firebase(fbUrl + '/' + key));
            },
            getData: function() {
              return $firebase(new Firebase(fbUrl));
            }
          };
        });
        **/