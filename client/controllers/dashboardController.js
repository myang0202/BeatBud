app.controller('dashboardController', ['$scope','userFactory', 'socketFactory','$location', function($scope, userFactory, socketFactory, $location) {
	// if(!userFactory.loggedIn){
	// 	console.log("asdasdasd")
	// 	$location.url("/");
	// }
	console.log("dashboard controller loaded")
	userFactory.getLoggedUser(function(data){
		if(data.hasOwnProperty("error")){
			return $location.url('/')
		} else {
			$scope.user = data
		}
	})
	$scope.nav = true
	$scope.search = ""
	$scope.delete = function(surveyid){
		pollFactory.delete(surveyid, function(data){
			pollFactory.getSurveys(function(data){
				$scope.surveys = data.surveys
				console.log(data)
			})
		})
	}
	$scope.logout = function(){
		userFactory.logout(function(data){
			console.log("logged out!")
			$location.url("/")
		})
	}
	$scope.room = function(){
		$location.url('/room')
	}
}]);