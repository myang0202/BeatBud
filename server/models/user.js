var mongoose = require('mongoose');
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
	first_name: {
		type: String, 
		required: true
	},
	email: {
		type: String, 
		required: true
	},
	password: {
		type: String,
		required: true
	}

}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

var Users = mongoose.model('users', UserSchema);