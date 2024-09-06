// Will take a bit of strategizing as per the tribe module
require('dotenv').config()
const { use } = require('passport')
const authenticate = require('../../auth/authentication')
const student = require('../../modules/student')
const tribe = require('../../modules/tribe')
const express = require('express')
const notifications = require('../../modules/notifications')
const app = express()

app.post('/fetch_notifications',authenticate, async(req,res)=>{
	try{
		const {
			user_id,
		}=req.body;
		if(!(user_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
		
		
		const user_details = await notifications.find({
			user_id:user_id
		})
		var arr = []
		for(var i=0;i<user_details.length;i++){
			var obj = {
				user_id:user_details[i].user_id,
				type:user_details[i].type,
				action_performed_by:user_details[i].action_performed_by,
				action_on_post_id:user_details[i].action_on_post_id
			}
			arr.push(obj)
		}
		return res.status(201).json({
			success:1,
			data: user_details
		})
	}catch(err){
		res.status(203).json({
			success:0,
			message:err
		})
	}
})
module.exports = app;