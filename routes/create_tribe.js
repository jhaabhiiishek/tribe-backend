// Will take a bit of strategizing as per the tribe module
require('dotenv').config()
const { use } = require('passport')
const authenticate = require('../auth/authentication')
const student = require('../modules/student')
const tribe = require('../modules/tribe')
const express = require('express')
const app = express()

app.post('/createtribe',authenticate, async(req,res)=>{
	try{
		const {
			user_id,
			name,
			tribe_type
		}=req.body;
		if(!(name&&tribe_type)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
		
		let num = 0;
		let val = 0;
		
		const posts_so_far = await tribe.find().sort({tribe_id : -1}).limit(1)
		if(posts_so_far[0]!=null&&posts_so_far[0]!=undefined&&posts_so_far[0]!=NaN){
			val = posts_so_far[0].tribe_id;
		}
		if(val==null||val ==undefined||val==NaN){
			val = 0;
		}
		num = val+1;


		const tribe_entry = await tribe.create({
			tribe_id:num,
			creator:user_id,
			name : name,
			members:[
				user_id
			],
			tribe_type : tribe_type,
		})
		const user_update = await student.updateOne({
			user_id:user_id
		},{
			$push:{
				tribes:num
			}
		})
		if(tribe_entry){
			res.status(201).json({
				success:1,
				data:{
					tribe_entry
				}
			})
		}else{
			res.status(203).json({
				success:0,
				data:{
					tribe_entry
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