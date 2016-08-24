var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
	first_name: {
		type: String, 
		required: true
	},
	last_name: {
		type: String, 
		required: true
	},
	email: {
		type: String, 
		required: true,
		unique: true, 
		validate: [{
			validator: function(string){
				return /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test( string );
			},
			message: "Please enter a valid email",
		}]	
	},
	password: {
		type: String,
		required: true,
		validate: [{
			validator: function(string){
				return string.length >= 8;
			},
			message: "Password must be greater than 8 chars",
		}]
	}

}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

UserSchema.pre('save', function(done){
	console.log("pre function")
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	done();
});

var Users = mongoose.model('users', UserSchema);