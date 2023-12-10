const post = require('../modules/post')
const express = require('express')
const authenticate = require('../auth/authentication')
const app = express()

app.post('/createpost',authenticate,async(req,res)=>{
	const{
		user_id,
		text
		// media_link,
	} = req.body

		if(!(user_id&&text)&&!(user_id&&media_link)){
			return res.status(203).json({
				success:0,
				msg:"The post can not be empty"
			})
		}

		if (text.length>2048){
			return res.status(203).json({
				success:0,
				msg: "post text can not be greater than 2048 characters"
			})
		}

		const words = text.split(" ")
		const tags = words.filter((string) => string.startsWith("#"));

		let num = 0;
		let val = 0;
		const posts_so_far = await post.find({
			user_id:user_id
		}).sort({user_post_id : -1}).limit(1)
		if((posts_so_far[0])&&(posts_so_far[0].user_post_id!=null||posts_so_far[0].user_post_id!=undefined)){
			val = posts_so_far[0].user_post_id;
		}
		if(val==null||val ==undefined||val==NaN){
			val = 0;
		}
		num = val+1;
		console.log(num)
	
	try{

		console.log("Post creation")
		const details = await post.create({
			user_id:user_id,
			user_post_id:num,
			tags:tags,
			is_tribe:false,
			text:text ,
			// media_link:media_link,
			upload_date:new Date()
		})
		console.log(details)
		return res.status(201).json({
			success:1,
			data: details,
			msg:"Post created"
		})
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:err
		})
	}
})

module.exports = app