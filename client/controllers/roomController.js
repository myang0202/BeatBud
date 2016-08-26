app.controller('roomController', ['$scope','userFactory', 'socketFactory', 'trackFactory', '$location', function($scope, userFactory, socketFactory, trackFactory, $location) {
	// if(!userFactory.loggedIn){
	// 	$location.url("/");
	// }
	userFactory.getLoggedUser(function(data){
		if(data.hasOwnProperty("error")){
			 $location.url('/')
		} else {
			$scope.user = data
			socketFactory.emit('new_user', {
				user: $scope.user
			})
	var temp;
	var player;

	$scope.messages = [];
	$scope.disableVote = false;
	$scope.disableNominate = false;
	$scope.scrolledToBottom = true;

	console.log("room controller loaded")

	$scope.sendMessage = function () {
		if($scope.newmessage == "/admin reset"){
			socketFactory.emit("change_track", {user: $scope.user})
		} else {
			socketFactory.emit('send_message', {
				message: $scope.newmessage,
				user: $scope.user
			});
			$scope.newmessage = "";
		}
	}
	socketFactory.on('post_new_message', function (message) {
		console.log("post messages" ,message)
		$scope.messages.push(message);
		console.log("client side scope message",$scope.messages);
		var element = document.getElementById('chatboard')
		if(element.scrollTop == element.scrollHeight - element.clientHeight){
			$scope.scrolledToBottom = true;
		} else {
			$scope.scrolledToBottom = false;
		}
	});
	socketFactory.on('user_join', function (data) {
		$scope.messages.push({
			user: {first_name: "beatbud"},
			message: data.user.first_name + ' has joined the room!'
		});
	});

	socketFactory.on('permissions', function(data){
		console.log(data)
		$scope.disableVote = data.hasVoted
		$scope.disableNominate = data.hasNominated
	})

    socketFactory.emit("get_track", {reason: "because I want the track"});
	socketFactory.on('current_track', function (data){
    	console.log(data.track);
    	var currentTrack = data.track
    	player = new YT.Player('player', {
	    	height: '270',
		    width: '480',
	        videoId: currentTrack,
		    playerVars: { 'autoplay': 1, 'rel': 0, 'start': data.time, 'controls': 0, 'disablekb': 0, 'iv_load_policy': 3, 'origin': 'http://www.youtube.com' },
		    events: {
		        'onReady': onPlayerReady,
		        'onStateChange': onPlayerStateChange
		    }
		});
		socketFactory.emit("get_related_tracks", {videoId: currentTrack});
	});
	socketFactory.on("related_tracks", function(data){
		console.log(data)
		$scope.voteoptions = data.related_tracks;
	})
	socketFactory.on('new_track', function(data){
		$scope.disableNominate = false;
		$scope.disableVote = false;
		currentTrack = data.track
		console.log(currentTrack)
		player.loadVideoById(currentTrack);
	});
	$scope.vote = function(id){
		$scope.disableVote = true;
		socketFactory.emit("vote", {videoId: id, user: $scope.user});
	}
	$scope.youtubeurl = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
	$scope.nominate = function(){
		if($scope.youtubeurl.test($scope.newvote)){
			$scope.disableNominate = true
			var index = $scope.newvote.indexOf("watch?v=")
			socketFactory.emit("nominate", {videoId: $scope.newvote.substring(index+8), user: $scope.user})
			$scope.newvote = ""
		}
	}
	$scope.logout = function(){
		userFactory.logout(function(data){
			console.log("logged out!")
			$location.url("/")
		})
	}
    var apikey = "AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU"



      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      function onPlayerStateChange(event) {
        console.log(event)
        if(event.data == 0){ //video has stopped
        	socketFactory.emit("change_track", {user: $scope.user})
        }
      }

      function stopVideo() {
        player.stopVideo();
      }
		}
	})
}]);