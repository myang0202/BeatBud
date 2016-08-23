var users = require('../controllers/users.js');
var tracks = require('../controllers/tracks.js');
console.log("routes loaded")
module.exports = function(app) {
	app.post('/login', users.login);
	app.post('/register', users.register)
	app.get('/users', users.allusers);
	// app.post('/vote', users.vote);
	// app.post('/survey', users.getSurvey);
	// app.post('/delete', users.deleteSurvey);
	app.post('/logout', users.logout);
	app.get('/loggedinuser', users.loggedInUser);
	app.get('/track', tracks.getTrack);
	app.post('/track', tracks.changeTrack);
}