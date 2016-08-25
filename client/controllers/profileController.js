app.controller('profileController', ['$scope','userFactory', 'socketFactory','$location', function($scope, userFactory, socketFactory, $location) {
	console.log("profile controller loaded")
	userFactory.getLoggedUser(function(data){
		if(data.hasOwnProperty("error")){
			$location.url('/')
		} else {
			$scope.user = data
		}
	})
}])
