// Will take a bit of strategizing as per the tribe module
require('dotenv').config()
const { use } = require('passport')
const authenticate = require('../auth/authentication')
const student = require('../modules/student')
const tribe = require('../modules/tribe')
const express = require('express')
const app = express()

app.post('/fetch_links',authenticate, async(req,res)=>{
	try{
		const {
			user_id
		}=req.body;
		if(!(user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
		
		
		const user_details = await student.findOne({
			user_id:user_id
		})
		if(user_details){
			res.status(201).json({
				success:1,
				data: user_details
			})
		}else{
			res.status(203).json({
				success:0,
				data:{
					user_details
				}
			})
		}
	}catch(err){
		res.status(203).json({
			success:0,
			message:err
		})
	}
})

module.exports= app