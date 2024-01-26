const jwt = require("jsonwebtoken");
const post = require('../modules/post')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../auth/authentication')
const login_creds = require('../modules/login_creds')
const LocalStrategy = require('passport-local').Strategy;

app.post('/login',
	async function(req, res) {
		try{
			const {
				user_id,
				password,
				g_pass
			} = req.body

			if(!(user_id && password) && !(g_pass)){
				return res.status(203).json({
					success:0,
					msg:"Userid and Password or google login are required "
				})
			}

			if(g_pass){
				const client_id = "128331685413-1rh7e21p5hfq813q7i0j5rs639e8ckpg.apps.googleusercontent.com"
				const secret = "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"
				fetch('<https://oauth2.googleapis.com/token>', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams({
						g_pass,
						client_id,
						secret,
					}),
				})
				.then(response => console.log(response.json()))
				.then(tokens => {
					console.log(tokens)
					res.json(tokens);
				})
				console.log("no error yet")
				return
				const result = await login_creds.findOne({
					
				})
				var student_token = jwt.sign({
					"user_id":result.user_id,
					"phone":result.phone,
					"email":result.email
				},
				process.env.TOKEN_KEY, {
					expiresIn: "7d",
				});
				let student = {
					token: student_token
				}
				console.log("1")
				res.cookie("student", student_token, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					sameSite:"none",
					secure:"true"
				});
			}

			function isNumeric(value) {
				return /^-?\d+$/.test(value);
			}

			if(isNumeric(user_id)){
				var studentPhone = await login_creds.findOne({
					phone:user_id
				})
			}
			var student = await login_creds.findOne({
				email:user_id.toLowerCase()
			})
			const user = await login_creds.findOne({
				user_id:user_id.toLowerCase()
			})

			var result = null;
			if(studentPhone!=null){
				result = studentPhone
			}
			if(student!=null){
				result = student
			}
			if(user!=null){
				result = user
			}

			if(result == null){
				return res.status(203).json({
					success: 0,
					msg: "User is not registered"
				});
			}
			
			var isUser = false;

			if(result&&password){
				const pass = result.password;
				isUser = bcrypt.compareSync(password,pass);
				if(!isUser){
					return res.status(203).json({
						success: 0,
						msg: "Wrong password entered"
					});
				}
			}
			
			if(isUser){
			
				var student_token = jwt.sign({
					"user_id":result.user_id,
					"phone":result.phone,
					"email":result.email
				},
				process.env.TOKEN_KEY, {
					expiresIn: "7d",
				});
				let student = {
					token: student_token
				}
				console.log("1")
				res.cookie("student", student_token, {
					maxAge: 7 * 24 * 60 * 60 * 1000,
					sameSite:"none",
					secure:"true"
				});
				console.log("2")
				return res.status(200).json({
					success: 1,
					user_id:result.user_id,
					msg: "Logged in successfully"
				});
			}
			return res.status(500).json({
				success: 0,
				msg: "Invalid creds"
			});
		}catch(err){
			console.log(err);
			return res.status(203).json({
				success: 0,
				msg: err
			});
		}
	}
);

module.exports= app