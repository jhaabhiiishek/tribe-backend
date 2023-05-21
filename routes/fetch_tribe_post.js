// find all posts of a tribe in last 3 days

const post = require('../modules/post')
const student = require('../modules/student')
const tribe = require('../modules/tribe')
const express = require('express')
const app = express()
const authenticate = require('../auth/authentication')

app.post('/fetch_tribe_post',authenticate, async(req,res) => {
	const {user_id} = req.body

	const tribe_requested = await tribe.findOne({
		tribe_id:tribe_id,
		members:user_id
	})

	if(!tribe_requested){
		return res.status(404).json({
			msg:"You do not belong to the tribe"
		})
	}

	if(tribe_requested.posts==undefined||tribe_requested.posts==null){
		return res.status(404).json({
			msg:"Could not fetch posts"
		})
	}

	let l=tribe_requested.posts.length;
	let post_response=[]

	try{
		for(var i =0;i<l;i++){
			post_response.concat(
				await post.find({
					is_tribe:true,
					upload_date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}
				})
			)
		}
        res.status(201).json({
            status: 'Success',
            data : {
                post_response
            }
        })
    }catch(err){
        return res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

module.exports= app