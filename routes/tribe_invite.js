// search
// profile

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
const tribeinvite = require('../modules/tribe_invite_module')
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



app.post('/tribe_invite',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			tribe_id,
			receiver_id
		} = req.body;
	
		if(!(user_id&&tribe_id&&receiver_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const tribe_fetch = await tribe.findOne({
			tribe_id:tribe_id,
			members:{$in:[user_id]}
		})

		if(tribe_fetch==null||tribe_fetch==undefined){
			return res.status(203).json({
				success:0,
				msg:"You do not belong to the tribe",
				data:tribe_fetch
			})
		}

		const invite = await tribeinvite.create({
			sender:user_id,
			receiver:receiver_id,
			sent_at: new Date(),
			tribe_id:tribe_id
		})
		if(invite){

			return res.status(201).json({
				success:1,
				msg:"success",
				data:invite
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:"Can not invite",
				data:invite
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:err
		})
	}
});
app.post('/fetch_tribe_invites',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
		} = req.body;
	
		if(!(user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const invite = await tribeinvite.find({
			receiver:user_id,
		}).sort({ $natural: -1 })
		if(invite!=null||invite!=undefined){
			return res.status(201).json({
				success:1,
				msg:"success",
				data:invite
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:"Can not fetch invites",
				data:invite
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:err
		})
	}
});
app.post('/response_tribe_invites',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			tribe_invite_id,
			response_to_invite
		} = req.body;
	
		if(!(user_id&&tribe_invite_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		if(response_to_invite){
			const deleteinvite = await tribeinvite.findOne({
				_id:tribe_invite_id,
				receiver:user_id
			})
			const invite = await student.findByIdAndUpdate({
				user_id:user_id
			},{
				$push:{
					tribes:deleteinvite.tribe_id
				}
			});
			const tribeinvite = await tribe.findByIdAndUpdate({
				tribe_id:deleteinvite.tribe_id
			},{
				$push:{
					members: user_id
				}
			})
	
		}
		const deleteinvite = await tribeinvite.findOneAndDelete({
			_id:tribe_invite_id,
			receiver:user_id
		})
		if(deleteinvite!=null||deleteinvite!=undefined){
			return res.status(201).json({
				success:1,
				msg:"successfull",
				data:deleteinvite
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:"Can not delete invites",
				data:deleteinvite
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			status:'failed',
			data:err
		})
	}
});

module.exports = app;