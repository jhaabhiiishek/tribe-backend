const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const path=require("path");
const session = require('cookie-session');
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const login_creds_schema = new mongoose.Schema({
    phone : {
        type : Number,
        required : false,
    },
    email : {
		type : String,
        required : true,
    },
	password :{
		type: String,
		required: true
	},
	user_id:{
		type:String,
		required:true,
	}
})
const login_creds =  mongoose.model('login_creds',login_creds_schema)

module.exports = login_creds