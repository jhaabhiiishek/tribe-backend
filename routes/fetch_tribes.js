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

app.use(session({
	secret: process.env.TOKEN_KEY,
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());



app.post('/delete_tribe',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			tribe_id
		} = req.body;
	
		if(!(user_id&&tribe_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}

		const triberes = await tribe.findOne({
			tribe_id:tribe_id,
			creator:user_id
		})

		if(triberes==null||triberes==undefined){
			return res.status(404).json({
				msg:"Only creator can delete tribes"
			})
		}else{
			const deltribe = await tribe.findOneAndDelete({
				tribe_id:tribe_id,
				creator:user_id
			})
			return res.status(201).json({
				msg:"Deleted successfully"
			})
		}


		
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});

app.post('/search_tribe',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			term,
			count
		} = req.body;
	
		if(!(user_id&&term&&count)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}

		let final_term = '/'+term+'/'

		const user_tribe = await tribe.find({
			name : {$regex : final_term,$options:'i'}
		}).limit(count)
		if(user_tribe){
			return res.status(204).json({
				msg:"success",
				data:user_tribe
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});
app.post('/fetch_tribes',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id
		} = req.body;
	
		if(!(user_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}

		const user_tribe = await student.findOne({
			user_id:user_id
		})
		
		if(user_tribe.tribes!=null||user_tribe.tribes!=undefined){
			return res.status(201).json({
				msg:"success",
				data:user_tribe.tribes
			})
		}

		else{
			return res.status(404).json({
				msg:"Can't fetch tribes",
				data:user_tribe.tribes
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