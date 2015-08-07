'use strict';
//angular.module('AppCtrl')
app.factory('PinFactory', function() {
	return {
		allPins: function() {
			var pins = {
				'awesome': '<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>',
				'music': '<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>',
				'fire': '<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>',
				'love': '<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>',
				'party': '<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>',
				'green': '<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>',
				'dialog': '<i class="icon-Geo2 pin dialog"><i class="icon-Speach-BubbleDialog symbol"></i></i>',
				'animals': '<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>',
				'medical': '<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>',
				'vehicle': '<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>',
				'sports': '<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>',
				'art': '<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>',
				'whoa': '<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>',
				'police': '<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>',
				'hero': '<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>'
			};
			return pins;
		},
		setPin: function(category) {
			var pins = {
				'awesome': '<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>',
				'music': '<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>',
				'fire': '<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>',
				'love': '<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>',
				'party': '<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>',
				'green': '<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>',
				'dialog': '<i class="icon-Geo2 pin dialog"><i class="icon-Speach-BubbleDialog symbol"></i></i>',
				'animals': '<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>',
				'medical': '<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>',
				'vehicle': '<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>',
				'sports': '<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>',
				'art': '<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>',
				'whoa': '<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>',
				'police': '<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>',
				'hero': '<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>'
			}
			var pin = pins[category];
			return pin;
		}
	}
})
	/**
	$scope.pins = {
		'awesome': '<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>',
		'music': '<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>',
		'fire': '<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>',
		'love': '<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>',
		'party': '<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>',
		'green': '<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>',
		'dialog': '<i class="icon-Geo2 pin dialog"><i class="icon-Speach-BubbleDialog symbol"></i></i>',
		'animals': '<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>',
		'medical': '<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>',
		'vehicle': '<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>',
		'sports': '<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>',
		'art': '<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>',
		'whoa': '<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>',
		'police': '<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>',
		'hero': '<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>'
	};
	**/
	/**
	$scope.pins = [
		'<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>',
		'<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>',
		'<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>',
		'<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>',
		'<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>',
		'<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>',
		'<i class="icon-Geo2 pin dialog"><i class="icon-Speach-BubbleDialog symbol"></i></i>',
		'<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>',
		'<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>',
		'<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>',
		'<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>',
		'<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>',
		'<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>',
		'<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>',
		'<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>'
	};
	

	$scope.awesome = '<i class="icon-Geo2 pin awesome"><i class="icon-Humor symbol"></i></i>';
    $scope.music = '<i class="icon-Geo2 pin music"><i class="icon-Music-Note2 symbol"></i></i>';
    $scope.fire = '<i class="icon-Geo2 pin fire"><i class="icon-Fire-Flame symbol"></i></i>';
    $scope.love = '<i class="icon-Geo2 pin love"><i class="icon-Heart symbol"></i></i>';
    $scope.party = '<i class="icon-Geo2 pin party"><i class="icon-Martini-Glass symbol"></i></i>';
    $scope.green = '<i class="icon-Geo2 pin green"><i class="icon-Environmental-3 symbol"></i></i>';
    $scope.dialog = '<i class="icon-Geo2 pin dialog"><i class="icon-Speach-BubbleDialog symbol"></i></i>';
    $scope.animals = '<i class="icon-Geo2 pin animals"><i class="icon-Cheetah symbol"></i></i>';
    $scope.medical = '<i class="icon-Geo2 pin medical"><i class="icon-Stethoscope symbol"></i></i>';
    $scope.vehicle = '<i class="icon-Geo2 pin vehicle"><i class="icon-Car-2 symbol"></i></i>';
    $scope.sports = '<i class="icon-Geo2 pin sports"><i class="icon-Baseball symbol"></i></i>';
    $scope.art = '<i class="icon-Geo2 pin art"><i class="icon-Pencil symbol"></i></i>';
    $scope.whoa = '<i class="icon-Geo2 pin whoa"><i class="icon-Surprise symbol"></i></i>';
    $scope.police = '<i class="icon-Geo2 pin police"><i class="icon-Police symbol"></i></i>';
    $scope.hero = '<i class="icon-Geo2 pin hero"><i class="icon-Batman-Mask symbol"></i></i>';
    
	$scope.pins = [
  		$sce.trustAsHtml($scope.awesome),
  		$sce.trustAsHtml($scope.music),
  		$sce.trustAsHtml($scope.fire),
  		$sce.trustAsHtml($scope.love),
  		$sce.trustAsHtml($scope.party),
  		$sce.trustAsHtml($scope.green),
  		$sce.trustAsHtml($scope.dialog),
  		$sce.trustAsHtml($scope.animals),
  		$sce.trustAsHtml($scope.medical),
  		$sce.trustAsHtml($scope.vehicle),
  		$sce.trustAsHtml($scope.sports),
  		$sce.trustAsHtml($scope.art),
  		$sce.trustAsHtml($scope.whoa),
  		$sce.trustAsHtml($scope.police),
  		$sce.trustAsHtml($scope.hero)
  	];
  	**/
  	/**
app.factory('PinFactory', function() {
    $scope.awesome = '<b>good</b>';
  	$scope.music = '<b>happy</b>';
  	$scope.fire = '<b>music</b>';
  	$scope.love = '<b>sad</b>';
  	$scope.party = '<b>crazy</b>';
  	$scope.green = '<b>fun</b>';
  	$scope.pins = [
  		$sce.trustAsHtml($scope.awesome),
  		$sce.trustAsHtml($scope.music),
  		$sce.trustAsHtml($scope.fire),
  		$sce.trustAsHtml($scope.love),
  		$sce.trustAsHtml($scope.party),
  		$sce.trustAsHtml($scope.green),
  		$sce.trustAsHtml($scope.dialog)
  	];
	return $scope.pins;
})

  	$scope.pins = {
  		'awesome': $sce.trustAsHtml($scope.awesome),
  		'music': $sce.trustAsHtml($scope.music),
  		'fire': $sce.trustAsHtml($scope.fire),
  		'love': $sce.trustAsHtml($scope.love),
  		'party': $sce.trustAsHtml($scope.party),
  		'green': $sce.trustAsHtml($scope.green),
  		'dialog':$sce.trustAsHtml($scope.dialog),
  		'animals': $sce.trustAsHtml($scope.animals),
  		'medical': $sce.trustAsHtml($scope.medical),
  		'vehicle': $sce.trustAsHtml($scope.vehicle),
  		'sports': $sce.trustAsHtml($scope.sports),
  		'art': $sce.trustAsHtml($scope.art),
  		'whoa': sce.trustAsHtml($scope.whoa),
  		'police': $sce.trustAsHtml($scope.police),
  		'hero': $sce.trustAsHtml($scope.hero)
  	};
  	$scope.setPin = function(category) {
  		var pins = {
	  		'awesome': $sce.trustAsHtml($scope.awesome),
	  		'music': $sce.trustAsHtml($scope.music),
	  		'fire': $sce.trustAsHtml($scope.fire),
	  		'love': $sce.trustAsHtml($scope.love),
	  		'party': $sce.trustAsHtml($scope.party),
	  		'green': $sce.trustAsHtml($scope.green),
	  		'dialog':$sce.trustAsHtml($scope.dialog),
	  		'animals': $sce.trustAsHtml($scope.animals),
	  		'medical': $sce.trustAsHtml($scope.medical),
	  		'vehicle': $sce.trustAsHtml($scope.vehicle),
	  		'sports': $sce.trustAsHtml($scope.sports),
	  		'art': $sce.trustAsHtml($scope.art),
	  		'whoa': sce.trustAsHtml($scope.whoa),
	  		'police': $sce.trustAsHtml($scope.police),
	  		'hero': $sce.trustAsHtml($scope.hero)
  		};
  		var pin = pins[category];
  		return pin;
  	}

**/