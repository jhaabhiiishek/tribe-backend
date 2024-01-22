// tribe invite
// search
// profile


// search by tribe_names

// Find all the users in the tribe

// Same as delete post except check if is_tribe is true
require('dotenv').config()

const post = require('../modules/post')
const express = require('express')
const tribe = require('../modules/tribe')
const app = express()
const student = require('../modules/student')
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../auth/authentication')
const mongoose = require('mongoose')
const login_creds = require('../modules/login_creds')
const link = require('../modules/pendinglinks')

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const comment = require('../modules/comment')

// app.use(session({
// 	secret: process.env.TOKEN_KEY,
// 	resave: false,
// 	saveUninitialized: false
// }));
// app.use(express.json())
// app.use(passport.initialize());
// app.use(passport.session());



app.post('/leave_tribe',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			tribe_id
		} = req.body;
	
		if(!(user_id&&tribe_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const tribe_removal = await tribe.findOneAndUpdate({
			tribe_id:tribe_id
		},{
			$pull:{
				members:user_id
			}
		})
		const user_removal = await tribe.findOneAndUpdate({
			user_id:user_id
		},{
			$pull:{
				tribes:tribe_id
			}
		})
		if(user_removal&&tribe_removal){
			return res.status(201).json({
				success:1,
				msg:"Left Tribe Successfully",
				data:user_tribe
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:"Error in leaving tribe",
			data:'err'
		})
	}
});

module.exports = app;