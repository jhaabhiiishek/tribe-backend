//Search as per params given from student details

// Edit student details routes


require("dotenv").config();

const post = require('../../modules/post')
const tribe = require('../../modules/tribe')
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

app.post('/find',authenticate,
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

app.post('/search_user_id',authenticate,
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
			const users = await student.find({
				$or: [
					{ user_id: { $regex: key } },
				]
			}).limit(noOfValues)
			if(users.length>0){
				return res.status(201).json({
					success: 1,
					msg:"success",
					data: users
				})
			}
			
			const results = await student.find({
				$or: [
					{ name: { $regex: key } },
					{ email: { $regex: key } },
					{ job: { $regex: key } },
					{ course: { $regex: key } },
					{ college: { $regex: key } },
					{ home_city: { $regex: key} },
					{ about: { $regex: key} },
					{ interests: {  $regex: new RegExp(key, "i") } }
				]
			}).limit(noOfValues)
			if(results){
				let filtered = results.filter((entry) => entry.user_id !== user_id);
				console.log(filtered)
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
		}catch(err){
			console.log(err);
			return res.status(203).json({
				success: 0,
				msg: err
			});
		}
	}
);


app.post('/search_val',authenticate,
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
			
			const results = await student.find({
				$or: [
					{ name: { $regex: key } },
					{ email: { $regex: key } },
					{ job: { $regex: key } },
					{ course: { $regex: key } },
					{ college: { $regex: key } },
					{ home_city: { $regex: key} },
					{ about: { $regex: key} },
					{ interests: {  $regex: new RegExp(key, "i") } }
				]
			}).limit(noOfValues)
			if(results){
				let filtered = results.filter((entry) => entry.user_id !== user_id);
				console.log(filtered)
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
		}catch(err){
			console.log(err);
			return res.status(203).json({
				success: 0,
				msg: err
			});
		}
	}
);

app.post('/search_val_by_type',authenticate,
	async function(req, res) {
		try{
			const {
				user_id,
				key,
				type,
				noOfValues
			} = req.body

			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"User_id is required"
				})
			}
			let results
			switch(type){
				case "name":
					results = await student.find({
						$or: [
							{ name: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "email":
					results = await student.find({
						$or: [
							{ email: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "job":
					results = await student.find({
						$or: [
							{ job: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "course":
					results = await student.find({
						$or: [
							{ course: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "college":
					results = await student.find({
						$or: [
							{ college: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "home_city":
					results = await student.find({
						$or: [
							{ home_city: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "about":
					results = await student.find({
						$or: [
							{ about: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "interests":
					results = await student.find({
						$or: [
							{ interests: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "tribe":
					results = await tribe.find({
						$or: [
							{ name: { $regex: key } },
						]
					}).limit(noOfValues)
					break;	
				case "tribe_type":
					results = await tribe.find({
						$or: [
							{ tribe_type: { $regex: key } },
						]
					}).limit(noOfValues)
					break;	
			}
			if(results){
				let filtered = results.filter((entry) => entry.user_id !== user_id);
				console.log(filtered)
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
		}catch(err){
			console.log(err);
			return res.status(203).json({
				success: 0,
				msg: err
			});
		}
	}
);
app.post('/search_post_by_type',authenticate,
	async function(req, res) {
		try{
			const {
				user_id,
				key,
				type,
				noOfValues
			} = req.body

			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"User_id is required"
				})
			}
			let results
			switch(type){
				case "name":
					results = await post.find({
						$or: [
							{ tags: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				case "text":
					results = await post.find({
						$or: [
							{ text: { $regex: key } },
						]
					}).limit(noOfValues)
					break;
				
			}
			if(results){
				let filtered = results.filter((entry) => entry.user_id !== user_id);
				console.log(filtered)
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