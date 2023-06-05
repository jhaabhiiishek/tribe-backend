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

app.use(session({
	secret: process.env.TOKEN_KEY,
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());



app.post('/fetch_tribe_users',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			tribe_id,
			count
		} = req.body;
	
		if(!(user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const user = await student.findOne({
			user_id:user_id
		})
		const user_tribe = await tribe.findOne({
			tribe_id:tribe_id
		})
		if(user_tribe==null||user_tribe==undefined){
			return res.status(500).json({
				msg:"No such tribe exists"
			})
		}
		if(user_tribe.members==undefined||user_tribe.members==null){
			return res.status(203).json({
				success:0,
				msg:"No members in the given tribe"
			})
		}
		console.log("No prob")
		let filteredArray =[]
		let i =0
		if(user.links!=undefined||user.links!=null){
			filteredArray = user.links.filter(value => user_tribe.members.includes(value));
			i=filteredArray.length
		}

		console.log(filteredArray)
		for(let j = i;j<count;j++){
			if(user_tribe.members[j]!=null||user_tribe.members[j]!=undefined){
				console.log(filteredArray)
				let val = user_tribe.members[j]
				filteredArray.concat(val)
			}
			console.log("count")
		}
		console.log("No prob3")
		return res.status(201).json({
			success:1,
			msg:"Success",
			data: filteredArray
		})
	}catch(err){
		return res.status(500).json({
			success:0,
			data:err
		})
	}
});

module.exports = app;