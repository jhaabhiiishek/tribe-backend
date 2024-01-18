const post = require('../modules/post')
const tribe = require('../modules/tribe')
const express = require('express')
const authenticate = require('../auth/authentication')
const app = express()
app.get('/',(req,res)=>{
	res.status(201).json({
		success:1,
		msg:"yes"
	})
})
app.post('/createtribepost',authenticate,async(req,res)=>{
	try{
		const{
			user_id,
			tribe_id,
			text 
		} = req.body

		if(!(user_id&&tribe_id)){
			return res.status(203).json({
				success:0,
				msg:"Enter all the required fields"
			})
		}
		
		const words = text.split(" ")
		const tags = words.filter((string) => string.startsWith("#"));
		
		let num = 0;
		let val = 0;
		const posts_so_far = await post.find({
			user_id:user_id
		}).sort({user_post_id : -1}).limit(1)
		console.log(posts_so_far)
		if(posts_so_far && posts_so_far.length>0){
			val = posts_so_far[0].user_post_id;
			if(val==null||val ==undefined||val==NaN){
				val = 0;
			}
		}
		num = val+1;
		console.log(num)
	

		const tribe_requested = await tribe.findOne({
			tribe_id:tribe_id,
			members:{$in:[user_id]}
		})

		console.log(tribe_requested)

		if(!tribe_requested){
			return res.status(203).json({
				success:0,
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
			// media_link:media_link,
			upload_date:new Date()
		})

		const tribeposts = await tribe.findOneAndUpdate({
			tribe_id:tribe_id
		},{
			$push: { posts: details._id } 
		})

		res.status(201).json({
			success:1,
			data: details,
			msg:"Post created"
		})
	}catch(err){
		res.status(203).json({
			success:0,
			msg:"Can't create post"
		})
	}
})

module.exports= app