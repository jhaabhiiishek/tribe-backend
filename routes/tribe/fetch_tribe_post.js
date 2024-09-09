// find all posts of a tribe in last 3 days

const post = require('../../modules/post')
const student = require('../../modules/student')
const tribe = require('../../modules/tribe')
const express = require('express')
const app = express()
const authenticate = require('../../auth/authentication')

app.post('/fetch_tribe_post',authenticate, async(req,res) => {
	const {user_id,tribe_id} = req.body

	const tribe_requested = await tribe.findOne({
		tribe_id:tribe_id,
		members:user_id
	})

	if(!tribe_requested){
		return res.status(203).json({
			success:0,
			msg:"You do not belong to the tribe"
		})
	}

	if(tribe_requested.posts==undefined||tribe_requested.posts==null){
		return res.status(203).json({
			success:0,
			msg:"Could not fetch posts"
		})
	}

	let postsrev=tribe_requested.posts.reverse()
	let l=tribe_requested.posts.length;
	let post_response=[]

	try{
		for(var i =0;i<l;i++){
			const postThis = await post.findOne({
				_id:postsrev[i]._id
				// is_tribe:true
			})
			post_response.push(postThis)
		}
        res.status(201).json({
            success:1,
            data : post_response
        })
    }catch(err){
        return res.status(203).json({
            success:0,
            message : err
        })
    }
})

module.exports= app