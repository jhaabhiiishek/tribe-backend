//Part of profile section in the final website
require('dotenv').config()

const post = require('../../modules/post')
const express = require('express')
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

app.use(session({
	secret: process.env.TOKEN_KEY, // the secret used to sign the session ID cookie
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());



app.post('/sendlinkrequest',authenticate, async function(req, res, next) {
	
	try{

		const {
			user_id, 
			receiver_user_id
		} = req.body;
	
		if(!(user_id&&receiver_user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
	
		const searchuid = await login_creds.findOne({
			user_id:user_id,
		})
		const receiveruid = await login_creds.findOne({
			user_id:receiver_user_id,
		})
	
		if(receiveruid==undefined&&(receiveruid.user_id!=null||receiveruid.user_id!=undefined)){
			return res.status(203).json({
				success:0,
				msg:"No Student exists with given user_id"
			})
		}

		const prev_link_check = await link.findOne({
			sender_user_id:user_id,
			receiver_user_id:receiver_user_id
		})
		if(prev_link_check){
			return res.status(203).json({
				success:0,
				msg:"Link request already sent"
			})
		}
	
		const new_link_req = await link.create({
			sender_user_id:user_id,
			receiver_user_id:receiver_user_id,
			sent_at:new Date()
		})
		if(new_link_req){
			return res.status(201).json({
				success:1,
				msg:'request sent',
				data: new_link_req
			})
		}
		else{
			return res.status(203).json({
				success:0,
				msg:'Failed to send link request',
				data: new_link_req
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:'err'
		})
	}
});


app.post('/acceptlinkrequest',authenticate, async function(req, res, next) {
	try{
		const {
			user_id, 
			sender_user_id
		} = req.body;
	
		if(!(user_id&&sender_user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}

		const receiver_student = await student.updateOne({
			user_id:user_id
		},{
			$push: { links: sender_user_id}
		})

		const sender_student = await student.updateOne({
			user_id:sender_user_id
		},{
			$push: { links: user_id}
		})

		const link_req = await link.deleteOne({
			sender_user_id:sender_user_id,
			receiver_user_id:user_id
		})
		if(receiver_student&&sender_student&&link_req){
			return res.status(201).json({
				success:1,
				msg:'accepted successfully',
				data: link_req
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:'An error occured',
				data: link_req
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:'err'
		})
	}
});

app.post('/rejectlinkrequest',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			sender_user_id
		} = req.body;
	
		if(!(user_id&&sender_user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
	
		const link_req = await link.deleteOne({
			sender_user_id:sender_user_id,
			receiver_user_id:user_id
		})
		if(link_req){
			return res.status(203).json({
				success:1,
				msg:'deleted successfully',
				data: link_req
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:'Can not find link request',
				data: link_req
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:'err'
		})
	}
});

app.post('/removelink',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			other_uid
		} = req.body;
	
		if(!(user_id&&other_uid)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
	
		const receiver_student = await student.updateOne({
			user_id:user_id
		},{
			$pull: { links: other_uid}
		})

		const sender_student = await student.updateOne({
			user_id:other_uid
		},{
			$pull: { links: user_id}
		})

		if(receiver_student&&sender_student){
			return res.status(201).json({
				success:1,
				msg:'deleted successfully'
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:'unsuccessful'
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:'err'
		})
	}
});

app.post('/fetchlinkrequests',authenticate, async function(req, res, next) {
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
	
		const receiver_student = await link.find({
			receiver_user_id:user_id
		})
		console.log(receiver_student)

		if(receiver_student){
			return res.status(201).json({
				success:1,
				status:'success',
				data: receiver_student
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:'unsuccessful',
				data: receiver_student
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:'err'
		})
	}
});
app.post('/fetchsentrequests',authenticate, async function(req, res, next) {
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
	
		const receiver_student = await student.find({
			sender_user_id:user_id
		})

		var arr = []
		for(var i=0;i<receiver_student.length;i++){
			arr.push(receiver_student[i].receiver_user_id)
		}
		if(receiver_student){
			return res.status(201).json({
				success:1,
				status:'success',
				data: arr
			})
		}else{
			return res.status(203).json({
				success:0,
				msg:'unsuccessful',
				data: arr
			})
		}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:'failed',
			data:'err'
		})
	}
});

module.exports= app