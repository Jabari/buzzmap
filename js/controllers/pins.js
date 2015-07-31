'use strict';
angular.module('AppCtrl', ['PinFactory'])
app.controller('PinCtrl', ['$scope', function($scope) {
	
	/*
   * if given group is the selected group, deselect it
   * else, select the given group
   if (pinProvider === 'awesome') {
  pinProvider.setPin('awesome')
  } else if (pinProvider === 'music') {
    pinProvider.setPin('music')
  } else if (pinProvider === 'fire') {
    pinProvider.setPin('fire')
  } else {
    pinProvider.setPin('fire')
  }
  app.provider('pin', function() {
  var awesome = '<b>good</b>';
  var music = '<b>happy</b>';
	var fire = '<b>music</b>';
	var love = '<b>sad</b>';
	var party = '<b>crazy</b>';
	var green = '<b>fun</b>';
	var pinCats = [
		awesome,
		music,
		fire,
		love,
		party,
		green
	];
	var pins;
	return {
	  setPin: function(value) {
	    pins = value
	  },
	  $get: function() {
	    return {
	      pin: pins
	    }
	  }
	}
})
.config(function(pinProvider) {
  pinProvider.setPin('<b>good</b>');
})
   */
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
}]);
//app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });