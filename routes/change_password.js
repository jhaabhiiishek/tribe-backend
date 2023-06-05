//Part of profile section in the final website
require('dotenv').config()

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

app.use(session({
	secret: process.env.TOKEN_KEY, // the secret used to sign the session ID cookie
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());



app.post('/changepassword',authenticate, async function(req, res, next) {
	const { user_id, password } = req.body;

	if(!(user_id&&password)){
		return res.status(203).json({
			success:0,
			msg:"Enter all the required fields"
		})
	}

	const searchuid = await login_creds.findOne({
		user_id:user_id,
	})

	if(searchuid==undefined&&(searchuid.user_id!=null||searchuid.user_id!=undefined)){
		return res.status(203).json({
			success:0,
			msg:"No Student exists with given user_id"
		})
	}


	bcrypt.hash(password, 10, async function(err, hash) {
		if (err) { return next(err); }

		const result =await login_creds.findOneAndUpdate({
			user_id:user_id
		},{
			password: hash
		})
		if(result){
			return res.status(201).json({
				success:1,
				data : {
					"user_id": user_id,
					"password":hash
				}
			})
		}
	})
  });

module.exports= app