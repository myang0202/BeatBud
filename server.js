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
var currentTrack = "X5VJX9kYf3Q" //This is the current track being played
var currentTime = 0
var relatedTracks = [] //This is where the server stores all the related tracks to the current track
var timeLoop;

io.sockets.on('connection', function (socket) {
	console.log("WE ARE USING SOCKETS!");

	socket.on("new_user", function(data){
		users.push(data.user)
	})

    socket.on("send_message", function(data){
        messages.push({message: data.message, user: data.user})
        io.emit("post_new_message", {message: data.message, user: data.user})
    })

  	socket.on("get_track", function (data){
  		if(currentTime == 0){
  			timeLoop = setInterval(function(){
  				currentTime += 1
  			}, 1000)
  		} 
    	socket.emit('current_track', {track: currentTrack, time: currentTime})
	})

	socket.on("get_related_tracks", function(data){
		if(relatedTracks.length == 0){
			var path = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=' + data.videoId + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'	
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
				    		relatedTracks.push({_id: i, title: related_tracks[i].snippet.title, description: related_tracks[i].snippet.description, votes: 0, videoId: related_tracks[i].id.videoId})
				    	}
				    }
				    io.emit("related_tracks", {related_tracks: relatedTracks})

				});
			}).on('error', function(e) { 
	  			console.log("Got error: " + e.message);
			});
		} else {
			socket.emit("related_tracks", {related_tracks: relatedTracks})
		}
	})
	socket.on("vote", function(data){
		for(var i = 0; i < relatedTracks.length; i++){
			if(relatedTracks[i].videoId == data.videoId){
				relatedTracks[i].votes += 1
				io.emit("related_tracks", {related_tracks: relatedTracks});
			}
		}
	})
	socket.on("nominate", function(data){
		var exists = false;
		for(var i = 0; i < relatedTracks.length; i++){
			if(relatedTracks[i].videoId == data.videoId){
				exists = true;
			}
		}
		if(!exists){
			var path = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + data.videoId + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'	
			https.get(path, function(res){
				console.log("@@@@@@@@@@@@@@@")
				var body = '';
				res.on('data', function(chunk){
					body += chunk;
				})
				res.on('end', () => {
				    var track = JSON.parse(body).items[0];
				    if(track.snippet.liveBroadcastContent == "none"){
				    	relatedTracks.push({_id: relatedTracks.length, title: track.snippet.title, description: track.snippet.description, votes: 0, videoId: track.id.videoId})
				    }
				    io.emit("related_tracks", {related_tracks: relatedTracks})

				});
			}).on('error', function(e) {
  				console.log("Got error: " + e.message);
			});
		}

	})
	socket.on("change_track", function(data){
		clearInterval(timeLoop)
		io.emit("post_new_message", {message: "Glad you liked the song! heres the next one :)", user: {first_name: "beatbud"}})
		var nextTrack = relatedTracks[0];
		for(var i = 0; i < relatedTracks.length; i++){
			if(relatedTracks[i].votes > nextTrack.votes){
				nextTrack = relatedTracks[i];
			}
		}
		currentTrack = nextTrack.videoId
		relatedTracks = []
		io.emit("related_tracks", {related_tracks: relatedTracks})
		currentTime = 0
		timeLoop = setInterval(function(){
				currentTime += 1
			}, 1000)
		io.emit("new_track", {track: currentTrack})
		var path = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=' + currentTrack + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU'	
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
			    		relatedTracks.push({_id: i, title: related_tracks[i].snippet.title, description: related_tracks[i].snippet.description, votes: 0, videoId: related_tracks[i].id.videoId})
			    	}
			    }
			    io.emit("related_tracks", {related_tracks: relatedTracks})

			});
		}).on('error', function(e) {
  			console.log("Got error: " + e.message);
		});
	})
})