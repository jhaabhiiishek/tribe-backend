require("dotenv").config();

const post = require('../modules/post')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../auth/authentication')
const login_creds = require('../modules/login_creds')
const LocalStrategy = require('passport-local').Strategy;
const jwt = require("jsonwebtoken");
const student = require('../modules/student');
const bodyParser = require("body-parser")


const TOKEN_KEY = process.env.TOKEN_KEY;
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/studentDetails',authenticate,
	async function(req, res) {
		try{
			const {
				user_id,
				name,
				about,
				dob,
				home_city,
				college,
				pass_out_year,
				course,
				job,
				interests
			} = req.body

			console.log("std_det")
			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"User_id is required"
				})
			}

			const final_cookie = req.cookies["student"];
        
			let token = null;
			if (typeof (final_cookie) == "string") {
				token = final_cookie
			} else {
				token = final_cookie.token
			}
			
			const verified = jwt.verify(token, TOKEN_KEY, async (err, decoded) => {
				if (err) {
					if (err.name == "TokenExpiredError") {
						res.clearCookie("student");
						return res.status(203).json({
							success: 0,
							error: "Your session was timeout. Please login again",
						});
					}
				} else {
					if (decoded.token_last == true) {
						return res.status(203).json({
							success: 0,
							message: "Internal Server Error"
						});
					}
					verified_user_id = decoded.user_id;
					if(req.body.user_id!=verified_user_id){
						return res.status(203).json({
							success: 0,
							message: "Bad request made"
						});
					}
				}
				console.log("Token Verification ended.....")
				verified_email=decoded.email;
				verified_phone= decoded.phone
			});

			const user = await login_creds.findOne({
				user_id:user_id
			})
			
			const studentDetails = await student.findOne({
				user_id:user_id
			})
			console.log(studentDetails)
			let dob_final = new Date(dob)

			if(studentDetails==null){
				console.log('here')
				console.log(token.phone)
				console.log(token.email)
				const details = await student.create({
					user_id:user_id,
					name:name,
					about:about,
					dob:dob_final,
					home_city:home_city,
					college:college,
					pass_out_year:pass_out_year,
					course:course,
					job:job,
					interests:interests,
					phone:verified_phone,
					email:verified_email
				})
				return res.status(201).json({
					success: 1,
					msg: details
				});
			}else{
				return res.status(203).json({
					success: 0,
					msg: "Student details already exist"
				});
			}

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