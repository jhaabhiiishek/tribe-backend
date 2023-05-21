// Edit student details routes


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

app.post('/editstudentDetails',authenticate,
	async function(req, res) {
		try{
			const {
				user_id,
				new_about,
				dob,
				new_home_city,
				new_college,
				new_pass_out_year,
				new_course,
				new_job,
				additional_interests
			} = req.body

			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"User_id is required"
				})
			}
			
			const studentDetails = await student.findOne({
				user_id:user_id
			})
			console.log(studentDetails)
			let dob_final = new Date(dob)

			if(studentDetails!=null){
				const details = await student.updateOne({
					user_id:user_id,
				},{
					about:new_about,
					dob:dob_final,
					home_city:new_home_city,
					college:new_college,
					pass_out_year:new_pass_out_year,
					course:new_course,
					job:new_job,
					$push:{
						interests : additional_interests
					}
				})
				return res.status(201).json({
					success: 1,
					msg: details
				});
			}else{
				return res.status(203).json({
					success: 0,
					msg: "Student details doesnt exist"
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