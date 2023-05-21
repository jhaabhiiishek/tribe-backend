// routes: upvote, upvoted_by, comment, delete comment

//Part of profile section in the final website
require('dotenv').config()

const post = require('../modules/post')
const express = require('express')
const app = express()
const student = require('../modules/student')
const bcrypt = require('bcrypt');
const passport = require('passport')
const authenticate = require('../auth/authentication')
const mongoose = require('mongoose')
const login_creds = require('../modules/login_creds')
const link = require('../modules/pendinglinks')

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const comment = require('../modules/comment')

app.use(session({
	secret: process.env.TOKEN_KEY, // the secret used to sign the session ID cookie
	resave: false,
	saveUninitialized: false
}));
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());



app.post('/upvote',authenticate, async function(req, res, next) {
	
	try{
		const {
			user_id, 
			posted_by,
			user_post_id
		} = req.body;
	
		console.log("inside upvote")
		if(!(user_id&&posted_by&&user_post_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}

		let num = 0;
		let val = 0;
		
		const posts_so_far = await post.find({
			user_id:posted_by,
			user_post_id:user_post_id
		})
		if((posts_so_far==undefined||posts_so_far==null)&&posts_so_far.upvotes){
			val = posts_so_far.upvotes
		}
		if(posts_so_far==null||posts_so_far==undefined){
			return res.status(500).json({
				status:' no comment exists',
				data: posts_so_far
			})
		}
		num = val+1;
		
		console.log(num)
		const checkpost = await post.findOne({
			user_id:posted_by,
			user_post_id:user_post_id
		})

		let searchpost;
		if(checkpost.upvoted_by&&checkpost.upvoted_by.includes(user_id)){
			num = val
			searchpost = await post.updateOne({
				user_id:posted_by,
				user_post_id:user_post_id
			},{
				upvotes:num,
				$pull:{ upvoted_by:user_id}
			})
		}else{
			searchpost = await post.updateOne({
				user_id:posted_by,
				user_post_id:user_post_id
			},{
				upvotes:num,
				$push:{ upvoted_by:user_id}
			})
		}

	
		if(searchpost==undefined||searchpost==null){
			return res.status(500).json({
				msg:"No such post exists"
			})
		}else{
			return res.status(201).json({
				msg:"Upvoted!",
				likes: num
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});


app.post('/getupvotedby',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			posted_by,
			user_post_id
		} = req.body;
	
		if(!(user_id)){
			return res.status(404).json({
				msg:"Enter all the required fields"
			})
		}

		const poster = await post.findOne({
			user_id:posted_by,
			user_post_id:user_post_id
		})

		if((poster==null||poster==undefined)&&(poster.upvoted_by==null||poster.upvoted_by==undefined)){
			return res.status(404).json({
				msg:"Can't get post"
			})
		}
		else{
			let final_data =[]
			final_data= poster.upvoted_by 
			return res.status(201).json({
				msg:"successful",
				data:final_data
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});

app.post('/comment',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			post_by_user_id,
			user_post_id,
			parent_comment_id,
			text
		} = req.body;
	
		if(!(user_id&&post_by_user_id&&user_post_id&&text)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}
	

		const comments = await comment.create({
			made_by_user_id:user_id,
			post_by_user_id:post_by_user_id,
			user_post_id:user_post_id,
			made_by_user_id:user_id,
			parent_comment_id:parent_comment_id,
			text:text,
			upload_date:new Date()
		})
		
		if(parent_comment_id&&(parent_comment_id!='')){
			const find_parent_comment = await comment.findOneAndUpdate({
				_id:parent_comment_id
			},{
				$push:{
					child_comment_id:comments._id
				}
			})
		}

		if(comments){
			return res.status(201).json({
				status:'commented successfully',
				data: comments
			})
		}else{
			return res.status(500).json({
				status:'Can not comment',
				data: link_req
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:err
		})
	}
});

app.post('/likepostcomment',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			_id
			// comment_id that has been liked
		} = req.body;
	
		if(!(user_id&&_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}
		let num = 0;
		let val = 0;
		
		const posts_so_far = await comment.find({
			_id:_id
		})
		if(posts_so_far&&posts_so_far.upvotes){
			val = posts_so_far.upvotes
		}
		if(posts_so_far==null||posts_so_far==undefined){
			return res.status(500).json({
				status:' no comment exists',
				data: posts_so_far
			})
		}
		num = val+1;
		
		const like_comment = await comment.updateOne({
			_id:_id
		},{
			upvotes:num
		})

		if(like_comment){
			return res.status(201).json({
				status:'commented successfully',
				data: like_comment
			})
		}else{
			return res.status(500).json({
				status:'Can not comment',
				data: like_comment
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});

app.post('/fetchpostcomment',authenticate, async function(req, res, next) {

		const {
			user_id,
			post_by_user_id,
			user_post_id,
			entries_required,
			parent_comment_id
		} = req.body;
	
		if(!(user_id&&post_by_user_id&&user_post_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}
	
		let response_items
		const comments = await comment.find({
			post_by_user_id:post_by_user_id,
			user_post_id:user_post_id,
			parent_comment_id:''
		})
		if(comments.length>entries_required){
			response_items = await comment.find({
				post_by_user_id:post_by_user_id,
				user_post_id:user_post_id,
				parent_comment_id:parent_comment_id
			}).sort({upvotes : -1}).limit(entries_required)
		}else{
			response_items = await comment.find({
				post_by_user_id:post_by_user_id,
				user_post_id:user_post_id,
				parent_comment_id:parent_comment_id
			})
		}

		if(comments){
			return res.status(201).json({
				status:'fetched successfully',
				data: response_items
			})
		}else{
			return res.status(500).json({
				status:'Can not find comments',
			})
		}
	// }catch(err){
	// 	return res.status(500).json({
	// 		status:'failed',
	// 		data:'err'
	// 	})
	// }
});

app.post('/deletepostcomment',authenticate, async function(req, res, next) {
	try{
		const {
			user_id,
			_id
		} = req.body;
	
		if(!(user_id&&_id)){
			return res.status(500).json({
				msg:"Enter all the required fields"
			})
		}

		console.log("Yhi hai problem")
		
		const this_comment = await comment.findOne({
			made_by_user_id:user_id,
			_id:_id
		})
		if(this_comment==null||this_comment==undefined){
			return res.status(404).json({
				msg:"Comment was not made by this user",
			})
		}
		if(this_comment.parent_comment_id!=""){
			const prev_comment = await comment.findOneAndUpdate({
				_id:this_comment.parent_comment_id
			},{
				$pull:{child_comment_id:_id}
			})
		}
		console.log("Isme toh nhi honi chahiye dikkat")
		const del_comment = await comment.findOneAndDelete({
			_id:_id
		})
		
		
		console.log("Not here for sure")
		if(this_comment){
			return res.status(201).json({
				status:'deleted successfully',
			})
		}else{
			return res.status(500).json({
				status:'Can not delete',
				data: this_comment
			})
		}
	}catch(err){
		return res.status(500).json({
			status:'failed',
			data:'err'
		})
	}
});

module.exports= app