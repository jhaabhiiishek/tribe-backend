const post = require('../modules/post')
const student = require('../modules/student')
const express = require('express')
const app = express()
const authenticate = require('../auth/authentication')

app.post('/fetch_user_post',authenticate, async(req,res) => {
	const {user_id} = req.body

	const student_link = await student.findOne({user_id:user_id})
	console.log(student_link)

	if(student_link==null || student_link == undefined){
		return res.status(201).json({
            status: 'Complete student details first'
        })
	}

	let l = student_link.links.length;
	console.log(l)
	var post_response = []

	try{
		for(var i =0;i<l;i++){
			let item = await post.find({
				user_id:student_link.links[i],
				is_tribe:false,
				upload_date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}
			})
			console.log(item)
			post_response.concat(item)
		}
        res.status(201).json({
            status: 'Success',
            data : post_response
        })
    }catch(err){
        return res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})

module.exports= app