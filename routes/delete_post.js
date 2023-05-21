// FindByUser_post_Id and delete
// routes: upvote, upvoted_by, comment, delete comment

//Part of profile section in the final website
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
	secret: process.env.TOKEN_KEY, // the secret used to sign the session ID cookie
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());



app.post('/delete_post',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			posted_by,
			user_post_id
		} = req.body;
	
		if(!(user_id&&posted_by&&user_post_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}
		if(posted_by!=user_id){
			return res.status(500).json({
				msg:"You can only delete your posts"
			})
		}

		const posts_so_far = await post.deleteOne({
			user_id:posted_by,
			user_post_id:user_post_id,
			is_tribe:false
		})
		if(!posts_so_far){
			return res.status(500).json({
				msg:"No such personal post existed, is it a tribe post?"
			})
		}else{
			return res.status(204).json({
				msg:"Deleted!"
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});

module.exports = app;