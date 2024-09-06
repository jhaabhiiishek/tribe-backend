//Search as per params given from student details

// Edit student details routes


require("dotenv").config();

const post = require('../../modules/post')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../../auth/authentication')
const login_creds = require('../../modules/login_creds')
const LocalStrategy = require('passport-local').Strategy;
const jwt = require("jsonwebtoken");
const student = require('../../modules/student');
const bodyParser = require("body-parser")


const TOKEN_KEY = process.env.TOKEN_KEY;
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/find/',authenticate,
	async function(req, res) {
		try{
			const {
				user_id,
				key
				// value,
				// count
			} = req.body

			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"User_id is required"
				})
			}
			
			const studentDetails = await student.findOne({
				user_id:key
			})

			let val = {};
			val[key]=value

			if(studentDetails!=null){
				const details = await student.find(val)
				let filteredResult = details.filter((entry) => entry.user_id !== user_id);
				return res.status(201).json({
					success: 1,
					msg:"success",
					data: filteredResult
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

app.post('/search',authenticate,
	async function(req, res) {
		try{
			const {
				user_id,
				key,
				noOfValues
			} = req.body

			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"User_id is required"
				})
			}
			
			const studentDetails = await student.find({
				user_id:{
					$regex: key
				}
			}).limit(noOfValues)
			let filteredResult = studentDetails.filter((entry) => entry.user_id !== user_id);

			
			if(filteredResult!=null){
				return res.status(201).json({
					success: 1,
					msg:"success",
					data: filteredResult
				});
			}else{
				const results = await student.find({
					$or: [
						{ name: { $regex: key } },
						{ email: { $regex: key } },
						{ dob: { $regex: key } },
						{ job: { $regex: key } },
						{ course: { $regex: key } },
						{ pass_out_year: { $regex: key } },
						{ college: { $regex: key } },
						{ home_city: { $regex: key} },
						{ about: { $regex: key} },
						{ interests: { $regex: key} }
					]
				})
				if(results){
					let filtered = results.filter((entry) => entry.user_id !== user_id);
					return res.status(201).json({
						success: 1,
						msg:"success",
						data: filtered
					})
				}
				return res.status(203).json({
					success: 0,
					msg: "Can't find student with given details"
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