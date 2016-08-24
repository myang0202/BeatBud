var mongoose = require('mongoose');
var Users = mongoose.model('users');
var bcrypt = require('bcrypt');
console.log("user controller loaded")

module.exports = {
	allusers: function(req,res){
		Users.find({}, function(err, allusers){
	    	res.json({users: allusers });
	    })
	},
	// getUser: function(req, res){
	// 	Users.findOne({_id: req.body.userid}, function(err, user){
	// 		if(err || !user) return res.json({error: "user not found"});

	// 		return res.json(user)
	// 	})
	// },
	login: function(req, res){
		Users.findOne({email: req.body.email}, function(err, user){
			if(err || !user ) return res.json({name: "error", message: "Invalid email"});

			if(!req.body.password) return res.json({name: "error", message: "Invalid password"})

			if(!bcrypt.compareSync(req.body.password, user.password)) {
				return res.json({name: "error", message: "Invalid password"})
			}
			req.session.userid = user._id
			console.log("logged in")
			console.log(req.session)
			res.json(user)
		})

	},
	register: function(req, res){
		var newuser = new Users({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password})
		newuser.save(function(err){
			if(err) return res.json(err);

			req.session.userid = newuser._id
			console.log("new user")
			console.log(req.session)
			return res.json(newuser)
		})
	},
	logout: function(req, res){
		req.session.userid = ""
		res.json({status: "logged off"})
	},
	loggedInUser: function(req, res){
		console.log(req.session)
		Users.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user) return res.json({error: "not logged in"});

			return res.json(user)
		})
	}
}










