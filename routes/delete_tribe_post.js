// Same as delete post except check if is_tribe is true
require('dotenv').config()

const post = require('../modules/post')
const express = require('express')
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



app.post('/delete_tribe_post',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			posted_by,
			user_post_id
		} = req.body;


	
		if(!(user_id&&posted_by&&user_post_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
		if(posted_by!=user_id){
			return res.status(203).json({
				success:0,
				msg:"You can only delete your posts"
			})
		}

		const posts_so_far = await post.deleteOne({
			user_id:posted_by,
			user_post_id:user_post_id,
			is_tribe:true
		})
		if(!posts_so_far){
			return res.status(203).json({
				success:0,
				msg:"No such tribe post existed, is it a personal post?"
			})
		}else{
			return res.status(201).json({
				success:1,
				msg:"Deleted!"
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			data:'err'
		})
	}
});

module.exports = app;