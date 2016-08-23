var mongoose = require('mongoose');
var Users = mongoose.model('users');
console.log("track controller loaded")

var currentTrack = "X5VJX9kYf3Q"

module.exports = {
	getTrack: function(req, res){
		return res.json({track: currentTrack})
	},
	changeTrack: function(req, res){
		currentTrack = req.body.newtrack
		return res.json({track: currentTrack})
	},
	// vote: function(req, res){
	// 	Surveys.findOne({_id: req.body.surveyid}, function(err, survey){
	// 		if(err || !survey) return res.json({error: "survey not found"});

	// 		if(req.body.option == "optionone"){
	// 			survey.optionone.votes += 1
	// 		} else if(req.body.option == "optiontwo"){
	// 			survey.optiontwo.votes += 1
	// 		} else if(req.body.option == "optionthree"){
	// 			survey.optionthree.votes += 1
	// 		} else if(req.body.option == "optionfour"){
	// 			survey.optionfour.votes += 1
	// 		} else {
	// 			return res.json({error: "option not found"})
	// 		}

	// 		survey.save(function(err){
	// 			if(err) return res.json(err);

	// 			console.log("succesfully voted")
	// 			res.json(survey)
	// 		})
	// 	})
	// },
	// getSurvey: function(req, res){
	// 	Surveys.findOne({_id: req.body.surveyid})
	// 	.populate('_user')
	// 	.exec(function(err, survey){
	// 		if(err || !survey) return res.json({error: "survey not found"});
	// 		console.log(survey)
	// 		return res.json(survey)
	// 	})
	// },	
	// // getUser: function(req, res){
	// // 	Users.findOne({_id: req.body.userid}, function(err, user){
	// // 		if(err || !user) return res.json({error: "user not found"});

	// // 		return res.json(user)
	// // 	})
	// // },
	// deleteSurvey: function(req, res){
	// 	Surveys.remove({_id: req.body.surveyid}, function(err){
	// 		if(err) return res.json({error: "survey not found"});

	// 		return res.json({status: "removed"})
	// 	})
	// },
	// login: function(req, res){
	// 	Users.findOne({email: req.body.email}, function(err, user){
	// 		if(err || !user ) return res.json({name: "error", message: "login failed"});

	// 			req.session.userid = user._id
	// 			console.log("logged in")
	// 			console.log(req.session)
	// 			res.json(user)
	// 	})
	// },
	// register: function(req, res){
	// 	Users.findOne({email: req.body.email}, function(err, user){
	// 		if(err) return res.json(err);
	// 		if(user) return res.json({error: "email already exists"});

	// 			var newuser = new Users({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password})
	// 			newuser.save(function(err){
	// 				if(err) return res.json(err);

	// 				req.session.userid = newuser._id
	// 				console.log("new user")
	// 				console.log(req.session)
	// 				return res.json(newuser)
	// 			})
	// 	})

	// },
	// logout: function(req, res){
	// 	req.session.userid = ""
	// 	res.json({status: "logged off"})
	// },
	loggedInUser: function(req, res){
		console.log(req.session)
		Users.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user) return res.json({error: "not logged in"});

			return res.json(user)
		})
	}
}










