// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
var http = require('http');
var https = require("https");

var session = require('express-session')
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true },
  rolling: true,
  // maxAge: 50000000
}))
// Require path
var path = require('path');
//Set up db
require('./server/config/mongoose.js');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './client')));
app.set('static', path.join(__dirname, './client'));
// Routes
// Root Request
require('./server/config/routes.js')(app)
// Setting our Server to Listen on Port: 8000
var server = app.listen(8000, function() {
    console.log("listening on port 8000");
})

var io = require('socket.io').listen(server)

var users = []; //This is where the server stores all the current users in the room
var messages = [] //This is where the server stores all the current messages in the chat
var currentTrack = "irOuRCkO0nQ" //This is the current track being played
var currentTime = 0
var relatedTracks = [] //This is where the server stores all the related tracks to the current track
var timeLoops = [];
var rooms = []

io.sockets.on('connection', function (socket) {
	console.log("WE ARE USING SOCKETS!");
	socket.on("new_room", function(data){
		socket.join(data.room_name)
		var path = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + data.room_link + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'
			https.get(path, function(res){
				console.log("@@@@@@@@@@@@@@@")
				var body = '';
				res.on('data', function(chunk){
					body += chunk;
				})
				res.on('end', () => {
				    var track = JSON.parse(body).items[0];
				    if(track.snippet.liveBroadcastContent == "none"){
				    	var newRoom = {room_name: data.room_name, room_password: data.room_password, currentTrack: data.room_link, users: [], relatedTracks: [], pastTracks : [], currentTime: 0, messages: [], thumbnail: track.snippet.thumbnails.default.url, current_track_name: track.snippet.title}
				    	rooms.push(newRoom)
				    	socket.emit("room_made", newRoom)
				    }
				});
			}).on('error', function(e) {
  				console.log("Got error: " + e.message);
			});
	})
	socket.on("get_rooms", function(data){
		console.log("getting rooms")
		console.log(rooms)
		socket.emit('all_rooms', {rooms: rooms})
	})
	socket.on("new_user", function(data){
		for(var i = 0; i < socket.rooms.length; i++){
			socket.leave(socket.rooms[i])
		}
		socket.join(data.room_name)
				console.log(socket.rooms)
		var userExists = false
		for(var i = 0; i < rooms.length; i++){
			for(var j = 0; j < rooms[i].users.length; j++){
				if(rooms[i].users[j].email == data.user.email){
					userExists = true
					socket.emit('permissions', {hasVoted: rooms[i].users[j].hasVoted, hasNominated: rooms[i].users[j].hasNominated})
				}
			}
		}
		if(!userExists){
			for(var i = 0; i < rooms.length; i++){
				if(rooms[i].room_name == data.room_name) {
					rooms[i].users.push({user: data.user, hasVoted: false, hasNominated: false})
					socket.emit('permissions', {hasVoted: false, hasNominated: false})
				}
			}
		}
		console.log('BROADCASTING TO ' + data.room_name)
		socket.broadcast.to(data.room_name).emit('user_join', {user: data.user})
	})

    socket.on("send_message", function(data){
    	for(var i = 0; i < rooms.length; i++){
			if(rooms[i].room_name == data.room_name) {
				rooms[i].messages.push({message: data.message, user: data.user})
				io.to(data.room_name).emit("post_new_message", {message: data.message, user: data.user})			}
		}
    })

  	socket.on("get_track", function (data){
  		console.log("roomname is:", data)
  		for(var i = 0; i < rooms.length; i++){
  			console.log(rooms[i])
  			if(rooms[i].room_name == data.room_name){
  				var currentRoom = rooms[i]
  				console.log("FOUND ITTTT")
  				if(currentRoom.currentTime == 0){
  					var timeLoop = setInterval(function(){
  					currentRoom.currentTime += 1
  					}, 1000)
  					timeLoops.push({timeLoop: timeLoop, room_name: currentRoom.room_name})
  				}
    			socket.emit('current_track', {track: currentRoom.currentTrack, time: currentRoom.currentTime})
  			}
  		}

	})

	socket.on("get_related_tracks", function(data){
		for(var i = 0; i < rooms.length; i++){
			if(rooms[i].room_name == data.room_name){
				if(rooms[i].relatedTracks.length == 0){
					console.log("ROOOM ISSSSS THISSSSSSSSS ", rooms[i])
					var room = rooms[i]
					var path = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=' + data.videoId + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'
					https.get(path, function(res){
						console.log("...................")
						var body = '';
						res.on('data', function(chunk){
							body += chunk;
						})
						res.on('end', () => {
						    var related_tracks = JSON.parse(body).items;
						    for(var j = 0; j < related_tracks.length; j++){
						    	if(related_tracks[j].snippet.liveBroadcastContent == "none"){
						    		room.relatedTracks.push({_id: j, title: related_tracks[j].snippet.title, description: related_tracks[j].snippet.description, votes: 0, videoId: related_tracks[j].id.videoId, thumbnail: related_tracks[j].snippet.thumbnails.default.url})
						    	}
						    }
						    io.to(data.room_name).emit("related_tracks", {related_tracks: room.relatedTracks})

						});
					}).on('error', function(e) {
			  			console.log("Got error: " + e.message);
					});
				} else {
					socket.emit("related_tracks", {related_tracks: rooms[i].relatedTracks})
				}
			}
		}
	})
	socket.on("vote", function(data){
		for(var j = 0; j < rooms.length; j++){
			if(rooms[j].room_name == data.room_name){
				for(var i = 0; i < rooms[j].relatedTracks.length; i++){
					if(rooms[j].relatedTracks[i].videoId == data.videoId){
						rooms[j].relatedTracks[i].votes += 1
						io.to(data.room_name).emit("related_tracks", {related_tracks: rooms[j].relatedTracks});
					}
				}
				for(var i = 0; i < rooms[j].users.length; i++){
					if(rooms[j].users[i].user.email == data.user.email){
						rooms[j].users[i].hasVoted = true
					}
				}
			}
		}
	})
	socket.on("nominate", function(data){
		for(var j = 0; j < rooms.length; j++){
			if(rooms[j].room_name == data.room_name){
				room = rooms[j]
				var exists = false;
				for(var i = 0; i < rooms[j].relatedTracks.length; i++){
					if(rooms[j].relatedTracks[i].videoId == data.videoId){
						exists = true;
					}
				}
				if(!exists){
					for(var i = 0; i < rooms[j].users.length; i++){
						if(rooms[j].users[i].user.email == data.user.email){
							rooms[j].users[i].hasVoted = true
						}
					}
					var path = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + data.videoId + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'
					https.get(path, function(res){
						console.log("@@@@@@@@@@@@@@@")
						var body = '';
						res.on('data', function(chunk){
							body += chunk;
						})
						res.on('end', () => {
						    var track = JSON.parse(body).items[0];
						    if(track.snippet.liveBroadcastContent == "none"){
						    	room.relatedTracks.push({_id: room.relatedTracks.length, title: track.snippet.title, description: track.snippet.description, votes: 0, videoId: track.id.videoId, thumbnail: track.snippet.thumbnails.default.url})
						    }
						    io.to(data.room_name).emit("related_tracks", {related_tracks: room.relatedTracks})

						});
					}).on('error', function(e) {
		  				console.log("Got error: " + e.message);
					});
				}
			}
		}
	})
	socket.on("change_track", function(data){
		// clearInterval(timeLoop)
		for(var j = 0; j < rooms.length; j++){
			if(rooms[j].room_name == data.room_name){
				room = rooms[j]
				var nextTrack = rooms[j].relatedTracks[0];
				for(var i = 0; i < rooms[j].relatedTracks.length; i++){
					if(rooms[j].relatedTracks[i].votes > nextTrack.votes){
						nextTrack = rooms[j].relatedTracks[i];
					}
				}
        rooms[j].pastTracks.push({thumbnail: rooms[j].thumbnail, current_track_name: rooms[j].current_track_name})
				rooms[j].currentTrack = nextTrack.videoId
				rooms[j].relatedTracks = []
				io.to(data.room_name).emit("related_tracks", {related_tracks: rooms[j].relatedTracks})
				rooms[j].currentTime = 0
				var newpath = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + nextTrack.videoId + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'
				https.get(newpath, function(res){
					console.log("@@@@@@@@@@@@@@@")
					var body = '';
					res.on('data', function(chunk){
						body += chunk;
					})
					res.on('end', () => {
					    var track = JSON.parse(body).items[0];
					    if(track.snippet.liveBroadcastContent == "none"){
					    	room.thumbnail = track.snippet.thumbnails.default.url
					    	room.current_track_name = track.snippet.title
					    }
					});
				}).on('error', function(e) {
  					console.log("Got error: " + e.message);
				});
				// timeLoop = setInterval(function(){
				// 		currentTime += 1
				// 	}, 1000)
				io.to(data.room_name).emit("new_track", {track: rooms[j]})
				var path = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=' + rooms[j].currentTrack + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'
				https.get(path, function(res){
					console.log("...................")
					var body = '';
					res.on('data', function(chunk){
						body += chunk;
					})
					res.on('end', () => {
					    var related_tracks = JSON.parse(body).items;
					    for(var i = 0; i < related_tracks.length; i++){
					    	if(related_tracks[i].snippet.liveBroadcastContent == "none"){
					    		room.relatedTracks.push({_id: i, title: related_tracks[i].snippet.title, description: related_tracks[i].snippet.description, votes: 0, videoId: related_tracks[i].id.videoId, thumbnail: related_tracks[i].snippet.thumbnails.default.url})
					    	}
					    }
					    io.to(data.room_name).emit("related_tracks", {related_tracks: room.relatedTracks})
					    for(var i=0; i < room.users.length; i++){
					    	room.users[i].hasVoted = false;
					    	room.users[i].hasNominated = false;
					    }
					    io.to(data.room_name).emit("permissions", {hasVoted: false, hasNominated: false})

					});
				}).on('error', function(e) {
		  			console.log("Got error: " + e.message);
				});
			}
		}
	})
})
