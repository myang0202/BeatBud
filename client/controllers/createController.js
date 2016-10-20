app.controller('createController', ['$scope','userFactory', 'socketFactory','roomFactory','$location', function($scope, userFactory, socketFactory, roomFactory,$location) {
	// if(!userFactory.loggedIn){
	// 	console.log("asdasdasd")
	// 	$location.url("/");
	// }
	console.log("create controller loaded")
	userFactory.getLoggedUser(function(data){
		if(data.hasOwnProperty("error")){
			return $location.url('/')
		} else {
			$scope.user = data
		}
	})
	$scope.nav = true
	$scope.search = ""
	$scope.room_name = ""
	$scope.room_password = ""
	$scope.room_link = ""
	$scope.logout = function(){
		userFactory.logout(function(data){
			console.log("logged out!")
			$location.url("/")
		})
	}
	$scope.room = function(){
		$location.url('/room')
	}
	$scope.youtubeurl = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
	$scope.create = function(){
		console.log("ertertert")
		if($scope.room_name != "" && $scope.youtubeurl.test($scope.room_link)){
			// roomFactory.create({room_name: $scope.room_name, room_link: $scope.room_link, room_password: $scope.room_password}, function(data){
	  //   		console.log("created new room")
	  //   		console.log(data)
	  //   	}
			var index = $scope.room_link.indexOf("watch?v=")
			console.log("preparing to make room")
	  		socketFactory.emit("new_room", {user: $scope.user, room_name: $scope.room_name, room_link: $scope.room_link.substring(index+8), room_password: $scope.room_password})
	    }
	}
	socketFactory.on("room_made", function(data){
		console.log("MADE A NEW ROOM")
		$location.url('/room/' + data.room_name)

	})
}]);