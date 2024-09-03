const post = require('../../modules/post')
const student = require('../../modules/student')
const express = require('express')
const app = express()
const authenticate = require('../../auth/authentication')

app.post('/fetch_post_by_user',authenticate, async(req,res) => {
	const {user_id,accToBeSearched} = req.body

	try{
		let item = await post.find({
			user_id:accToBeSearched,
			// upload_date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}
		}).sort({ $natural: -1 })
		console.log(item)
        res.status(201).json({
            success:1,
            data : item
        })
    }catch(err){
        return res.status(203).json({
            success:0,
            message : err
        })
    }
})

module.exports= app