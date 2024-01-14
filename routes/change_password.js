require('dotenv').config()

const post = require('../modules/post')
const otp_mod = require('../modules/otp')
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



app.post('/changepassword', async function(req, res, next) {
	const {email_id, password,otp } = req.body;

	if(!(email_id&&password&&otp)){
		return res.status(203).json({
			success:0,
			msg:"Enter all the required fields"
		})
	}

	const searchuid = await login_creds.findOne({
		email:email_id
	})
	console.log(searchuid)
	if(searchuid==undefined&&(searchuid.user_id==null||searchuid.user_id==undefined)){
		return res.status(203).json({
			success:0,
			msg:"No Student exists with given user_id"
		})
	}

	const otp_entered = await otp_mod.findOne({
		email : email_id
	})
	if(otp_entered==null||otp_entered==undefined){
		return res.status(203).json({
			success :0,
			msg :" Create an OTP first"
		})
	}
	else{
		const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
		const currentDate = new Date();
		const elapsedTime = currentDate - otp_entered.sent_at;
		const checkIfFifteenMinutesHavePassed=(elapsedTime >= fifteenMinutesInMilliseconds)?true:false;
		if(checkIfFifteenMinutesHavePassed){
			console.log("Check mhgbf")
			return res.status(203).json({
				success :0,
				msg :"Your OTP is no longer valid",
			})
		}
		else if(otp_entered.otp==otp){
			const new_otp = await otp_mod.updateOne({
				email : email_id,
			},{
				verified : true
			})
			bcrypt.hash(password, 10, async function(err, hash) {
				if (err) { 
					console.log(err)
				 }
				const result =await login_creds.findOneAndUpdate({
					user_id:searchuid.user_id
				},{
					password: hash
				})
				if(result){
					console.log("Check n")
					return res.status(201).json({
						success:1,
						data : {
							"user_id": searchuid.user_id,
							"password":hash
						}
					})
				}else{
					console.log("Check o")
					return res.status(203).json({
						success:0,
						msg:"Can not change password"
					})
				}
			})
		}else{
			return res.status(203).json({
				success :0,
				msg :" Wrong OTP entered",
			})
		}
	}


});

module.exports= app