angular.module('AppCtrl', ['ngMap', 'Auth', 'ngCordova'])
app.controller('UploadCtrl', ['$scope', '$timeout', '$sce', 'PinFactory', 'map_style', function($scope, $timeout, $sce, PinFactory, map_style){
  
  var PROJECT = '1094422292806';
    
  var clientId = '1094422292806-ek5skvmt27vq144s24n3au6q3bndnnbg.apps.googleusercontent.com';

  var apiKey = 'AIzaSyDco5QTiofu_3iI_ArCoK3t5nwNee1TilA';

  var scopes = 'https://www.googleapis.com/auth/devstorage.read_only';

  var API_VERSION = 'v1';

  var BUCKET = 'bm-vids';

  var object;

  var GROUP = '00b4903a9714df5bb21138cb0f4201f710b773baa50f1bd7625b757d2d460356';

  var ENTITY = 'allUsers';

  var ROLE = 'READER';

  var ROLE_OBJECT = 'READER';

  var upload = 0;

  var time = new Date();

  var exp = new Date(time.getTime() + 9 * 60000);

  document.getElementById('upload_title').focus();

$scope.$on('mapInitialized', function(event, map) {
    /**
     * Google Cloud Storage API request to insert an object into
     * your Google Cloud Storage bucket.
     */
    function insertObject(event) {
      try{
        var fileData = event.target.files[0];
      } 
      catch(e) {
        //'Insert Object' selected from the API Commands select list
        //Display insert object button and then exit function
        filePicker.style.display = 'block';
        return;
      }
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var reader = new FileReader();
      reader.readAsBinaryString(fileData);
      reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var filename = fileData.name + Date.now() + Math.round(Math.random() * 1000);
        var metadata = {
          'name': filename,
          'mimeType': contentType
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

        //Note: gapi.client.storage.objects.insert() can only insert
        //small objects (under 64k) so to support larger file sizes
        //we're using the generic HTTP request method gapi.client.request()
        var request = gapi.client.request({
          'path': '/upload/storage/' + API_VERSION + '/b/' + BUCKET + '/o',
          'method': 'POST',
          'params': [
          {'uploadType': 'multipart'},
          {"acl": "public-read" },
          {"bucket": "bm-vids"}
          ],
          'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
        /**'expiration': exp,
           "conditions": [
            {"acl": "public-read" },
            {"bucket": "bm-vids"},
            ["eq", "$Content-Type", contentType ],
            ["content-length-range", 0, 50000000] //20mb
           ],
           **/ 
          'body': multipartRequestBody
        });
          //Remove the current API result entry in the main-content div
        try{
          //Execute the insert object request
          executeRequest(request, 'insertObject');
          //Store the name of the inserted object 
          object = filename;
          object = encodeURI(object);
          document.getElementById('url').value = object;

        }
        catch(e) {
          alert('An error has occurred: ' + e.message);
        }
      }
    }

    function runSelectedApiRequest() {
      updateApiResultEntry(insertObject);
    }

    /**
     * Executes your Google Cloud Storage request object and, subsequently,
     * inserts the response into the page.
     * @param {string} request A Google Cloud Storage request object issued
     *    from the Google Cloud Storage JavaScript client library.
     * @param {string} apiRequestName The name of the example API request.
     */
    function executeRequest(request, apiRequestName) {
      request.execute(function(resp) {
        console.log(resp);
        upload++;
        console.log("upload: " + upload);
        var apiRequestNode = document.createElement('div');
 
        //If the selected API command is not 'insertObject', pass the request
        //paramaters to the getCodeSnippet method call as 'request.B.rpcParams'
        //else pass request paramaters as 'request.B' 
        
        var apiResponseEntry = document.createElement('pre');
        apiResponseEntry.innerHTML = JSON.stringify(resp, null, ' ');
      });
    }
    /**
     * Load the Google Cloud Storage API.
     */
    function initializeApi() {
      gapi.client.load('storage', API_VERSION);
    }

    window.onload = function() {
      handleClientLoad();
    }
    /**
    $(window)
      .bind('load', function() {
        handleClientLoad();
    });
    /**
     * Set required API keys and check authentication status.
     */
    function handleClientLoad() {
      gapi.client.setApiKey(apiKey);
      window.setTimeout(checkAuth, 1);
    }

    /**
     * Authorize Google Cloud Storage API.
     */
    function checkAuth() {
      gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
      }, handleAuthResult);
    }

    /**
     * Handle authorization.
     */
    function handleAuthResult(authResult) {
      var authorizeButton = document.getElementById('authorize-button');
      if (authResult && !authResult.error) {
        initializeApi();
        filePicker.onchange = insertObject;
      } else {
        gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
        }, handleAuthResult);
      return false;
      }
    }

    var onComplete = function(error, vidUrl) {
      if (error) {
          console.log('Synchronization failed');
      } else {
        upload++;
        console.log("upload: " + upload);
        console.log('Upload & Synchronization succeeded');
        console.log(vidUrl);
        document.getElementById('button-bg').style.top = "0px";
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.home');
        }
    };

    $scope.$watch(function(){ 
      $scope.description = document.getElementById('upload_description').value;
      $scope.vidTags = $scope.description.match(/(^|\s)(#[a-z\d-]+)/ig);   
      $scope.desc = $scope.description.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
      $scope.when = document.getElementById('upload_when').value;
    });
    
    $scope.locate = function() {
      $('#button-bg').css('top', '0px');
      var center = map.getCenter();
      var lat = center.k;
      var lng = center.D;
      console.log($scope.vidTags);
      console.log($scope.desc);
      console.log($scope.when);
      console.log("long: " + lng + "; lat: " +lat);
    }

    var ref = new Firebase('https://buzzmapv0.firebaseio.com/videos');
    ref.on('value', function(snapshot, event) {
        console.log(snapshot.val());
        angular.element(document.querySelector('#upload')).bind('submit', function() {
            var vidNumber = snapshot.val().length ++;
            var vidTitle = document.getElementById('upload_title').value;
            var vidDesc = $scope.desc;
            var vidTags = $scope.vidTags;
            //var vidUser = document.getElementById('user').value;
            var lat = map.getCenter().k;
            var lng = map.getCenter().D;
            var vidUrl = "https://storage.googleapis.com/bm-vids/" + document.getElementById('url').value;
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
    
    var awesome = '<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>';
    var music = '<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>';
    var fire = '<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>';
    var love = '<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>';
    var party = '<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>';
    var green = '<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>';
    var dialog = '<i class="icon-Geo2 pin dialog"><i class="icon-Speach-BubbleDialog symbol"></i></i>';
    var animals = '<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>';
    var medical = '<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>';
    var vehicle = '<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>';
    var sports = '<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>';
    var art = '<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>';
    var whoa = '<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>';
    var police = '<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>';
    var hero = '<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>';
    //marker1.bindTo('position', map, 'center');
    $scope.getMapCoords = function() {
      map.getCenter();
      return google.maps.LatLng.lat();
    };
    
    $scope.chosenPin = awesome;
    vidCat = "awesome";

    var mapStyle = map_style.style1();
    map.setOptions({styles: mapStyle, zoom: 15, minZoom: 8, keyboardShortcuts: false});

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
    $scope.pins = PinFactory.allPins();
    console.log($scope.pins);
    
    angular.element(document.querySelectorAll('.pin')).on('click', function(event) {
      console.log('pin clicked');
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
    
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON();
    })

    //$scope.time = new Date().toDateInputValue().slice(0,10);
    //console.log($scope.time);        
      
});


}]
);