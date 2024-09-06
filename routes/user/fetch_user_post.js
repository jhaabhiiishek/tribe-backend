const post = require('../../modules/post')
const student = require('../../modules/student')
const express = require('express')
const app = express()
const authenticate = require('../../auth/authentication')

app.post('/fetch_user_post',authenticate, async(req,res) => {
	const {user_id} = req.body

	const student_link = await student.findOne({user_id:user_id})
	console.log(student_link)

	if(student_link==null || student_link == undefined){
		return res.status(203).json({
			success:0,
            status: 'Complete student details first'
        })
	}

	let l = student_link.links.length;
	var post_response = []

	try{
		for(var i =0;i<l;i++){
			const item = await post.find({
				user_id:student_link.links[i],
				is_tribe:false,
				// upload_date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}
			}).sort({ $natural: -1 })
			console.log("item: "+item)
			post_response.push(item)
		}
		console.log(post_response)
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
app.post('/fetch_post_by_id',authenticate, async(req,res) => {
	const {user_id, post_owner, user_post_id} = req.body

	const student_link = await student.findOne({user_id:post_owner})

	if(student_link==null || student_link == undefined){
		return res.status(203).json({
			success:0,
            status: 'User doesnt exist'
        })
	}

	try{
		const item = await post.findOne({
			user_id:post_owner,
			user_post_id:user_post_id,
			// upload_date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}
		})
        res.status(201).json({
            success:1,
            data : item
        })
    }catch(err){
		console.log(err)
        return res.status(203).json({
            success:0,
            message : err
        })
    }
})

module.exports= app