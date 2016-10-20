app.controller('browseController', ['$scope','userFactory', 'socketFactory','roomFactory','$location', function($scope, userFactory, socketFactory, roomFactory,$location) {
	// if(!userFactory.loggedIn){
	// 	console.log("asdasdasd")
	// 	$location.url("/");
	// }
	console.log("browse controller loaded")
	userFactory.getLoggedUser(function(data){
		if(data.hasOwnProperty("error")){
			return $location.url('/')
		} else {
			$scope.user = data
		}
	})
	socketFactory.emit("get_rooms", {reason: "because i said so"})
	socketFactory.on("all_rooms", function(data){
		console.log(data)
		$scope.rooms = data.rooms
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
	$scope.goToRoom = function(room_name){
		console.log("rooooom")
		$location.url('/room/' + room_name)
	}
	$scope.create = function(){
		$location.url('/create')
	}
}]);