// search by tribe_names

// Find all the users in the tribe

// Same as delete post except check if is_tribe is true
require('dotenv').config()

const post = require('../../modules/post')
const express = require('express')
const tribe = require('../../modules/tribe')
const app = express()
const student = require('../../modules/student')
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../../auth/authentication')
const mongoose = require('mongoose')
const login_creds = require('../../modules/login_creds')
const link = require('../../modules/pendinglinks')

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const comment = require('../../modules/comment')

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
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const triberes = await tribe.findOne({
			tribe_id:tribe_id,
			creator:user_id
		})

		if(triberes==null||triberes==undefined){
			return res.status(203).json({
				success:0,
				msg:"Only creator can delete tribes"
			})
		}else{
			const deltribe = await tribe.findOneAndDelete({
				tribe_id:tribe_id,
				creator:user_id
			})
			return res.status(201).json({
				success:1,
				msg:"Deleted successfully"
			})
		}


		
	}catch(err){
		return res.status(203).json({
			success:0,
			data:'err'
		})
	}
});

app.post('/search_tribe',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id,
			term,
			count,
			tribe_id
		} = req.body;
	
		if(!((user_id&&term&&count)||(user_id&&tribe_id))){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		if(tribe_id){
			const user_tribe = await tribe.findOne({
				tribe_id:tribe_id
			})
			if(user_tribe){
				return res.status(201).json({
					success:1,
					msg:"success",
					data:user_tribe
				})
			}
		}

		let final_term = '/'+term+'/'

		const user_tribe = await tribe.find({
			name : {$regex : final_term,$options:'i'}
		}).limit(count)
		if(user_tribe){
			return res.status(201).json({
				success:1,
				msg:"success",
				data:user_tribe
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
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
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
		
		const user_tribe = await student.findOne({
			user_id:user_id
		})
		console.log(user_tribe)
		
		var tribes_data = []
		console.log('here')
		if(user_tribe &&(user_tribe.tribes.length>0)){
			for(let i = 0;i<user_tribe.tribes.length;i++){
				const tribe_data = await tribe.findOne({
					tribe_id: user_tribe.tribes[i]
				})
				tribes_data.push(tribe_data)
			}

			return res.status(201).json({
				success:1,
				msg:"success",
				data:tribes_data
			})
		}
		
		else{
			return res.status(203).json({
				success:0,
				msg:"No tribes to display",
				data:tribes_data
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