const post = require('../modules/post')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../auth/authentication')
const mongoose = require('mongoose')
const login_creds = require('../modules/login_creds')

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const otp = require('../modules/otp');

app.use(session({
	secret: 'my-secret-key', // the secret used to sign the session ID cookie
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());


app.post('/signup', async function(req, res, next) {
	const { phone,email,user_id, password } = req.body;

	if(!(phone||email) || !(password) ||!user_id){
		return res.status(500).json({
			msg:"Enter all the required fields"
		})
	}

	const searchuid = await login_creds.find({
		user_id:user_id,
	})

	console.log(searchuid[0])

	if(searchuid[0]!=undefined&&(searchuid[0].user_id!=null||searchuid[0].user_id!=undefined)){
		return res.status(500).json({
			msg:"Student exists with given user_id"
		})
	}

	const searchemail = await login_creds.find({
		email:email,
	})
	
	if(searchemail[0]!=undefined&&(searchemail[0].user_id!=null||searchemail[0].user_id!=undefined)){
		return res.status(500).json({
			msg:"Student exists with given email"
		})
	}
	
	if(phone){
		const searchphone = await login_creds.find({
			phone:phone,
		})
		
		if(searchphone[0]!=undefined&&(searchphone[0].user_id!=null||searchphone[0].user_id!=undefined)){
			return res.status(404).json({
				msg:"Student exists with given phone"
			})
		}
	}
	
	const checkOtp = await otp.findOne({
		email:email,
	})
	
	if(checkOtp==undefined||checkOtp==null){
		return res.status(404).json({
			msg:"Your email isnt verified"
		})
	}
	if((checkOtp!=undefined||checkOtp!=null)&&checkOtp.verified==false){
		return res.status(404).json({
			msg:"Kindly get your email Verified"
		})
	}

	bcrypt.hash(password, 10, async function(err, hash) {
		if (err) { return next(err); }
		const newUser = new login_creds({
			phone: phone,
			user_id:user_id.toLowerCase(),
			email: email.toLowerCase(),
			password: hash
		});
		const result =await newUser.save()
		console.log(result,"is res")
		if(result){
			return res.status(201).json({
				status: 'Success',
				msg:"now to student details",
				data : {
					"user_id": user_id,
					"password":hash
				}
			})
		}
	})
  });

module.exports= app