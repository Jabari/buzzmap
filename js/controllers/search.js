angular.module('AppCtrl', [])
.controller('SearchCtrl', ['$scope', function($scope, $firebase, SynchFactory) {
// this module will contain logic for searching videos via tag, location, title, etc
	var ref = SynchFactory.fb_vids;
	ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
	  console.log(snapshot.key());
	});
	
}]);