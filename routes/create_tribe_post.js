const post = require('../modules/post')
const tribe = require('../modules/tribe')
const express = require('express')
const authenticate = require('../auth/authentication')
const app = express()

app.post('/createtribepost',authenticate,async(req,res)=>{
	try{
		const{
			user_id,
			tags,
			tribe_id,
			text ,
			media_link,
		} = req.body
		if(!(user_id&&tribe_id)){
			return res.status(201).json({
				msg:"Enter all the required fields"
			})
		}
		console.log("shuru hua hu")

		let num = 0;
		let val = 0;
		const posts_so_far = await post.find({
			user_id:user_id
		}).sort({user_post_id : -1}).limit(1)
		console.log(posts_so_far)
		val = posts_so_far[0].user_post_id;
		if(val==null||val ==undefined||val==NaN){
			val = 0;
		}
		num = val+1;
		console.log(num)
	

		const tribe_requested = await tribe.findOne({
			tribe_id:tribe_id,
			members:user_id
		})

		if(!tribe_requested){
			return res.status(204).json({
				msg:"You do not belong to the tribe"
			})
		}

		console.log("Post creation")
		const details = await post.create({
			user_id:user_id,
			user_post_id:num,
			tags:tags,
			is_tribe:true,
			text:text ,
			media_link:media_link,
			upload_date:new Date()
		})

		const tribeposts = await tribe.findOneAndUpdate({
			tribe_id:tribe_id
		},{
			$push: { posts: details._id } 
		})

		res.status(201).json({
			status:'success',
			msg:{
				details
			}
		})
	}catch(err){
		res.status(500).json({
			status:'Failed',
			message:err
		})
	}
})

module.exports= app