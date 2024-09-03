const post = require('../../modules/post')
const express = require('express')
const authenticate = require('../../auth/authentication')
const app = express()
const multer = require('multer')
var path = require("path");
const fs = require('fs');
var uuid = require("uuid");
const aws = require('aws-sdk');

var organization_id = 'tribebyabhishek';
var s3 = new aws.S3({
    region:process.env.REGION,
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.ACCESS_SECRET
});

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

app.post('/uploadSingleFile',[authenticate,upload.single('file')],async(req,res)=>{

	try{
		const{
			user_id
		} = req.body
		
			if(!(user_id)){
				return res.status(203).json({
					success:0,
					msg:"The file can not be empty"
				})
			}
	
			console.log("here-in file upload")
			console.log(req.file)
			console.log(req.body)
			
			firstpart=req.file.originalname.substring(0,req.file.originalname.lastIndexOf('.'))
			lastpart=req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))
			uniqueId = uuid.v4();	
			uid = uniqueId;
			console.log("Uid = "+uid);
			file_link = "https://"+organization_id+".s3.amazonaws.com/"+user_id+'/'+firstpart+uid+lastpart;
			console.log("Uid = "+uid);
			
			const params ={
				Bucket: organization_id,
				Key:user_id+'/'+firstpart+uid+lastpart,
				Body: req.file.buffer,
				ContentType: req .file.mimetype,
				ACL:'public-read'
			}
			console.log("Uid = "+uid);
			
			await s3.putObject(params,(error,success)=>{
				if(error){
					console.log(error)
				}
				console.log(success)
			})
			console.log(file_link)
			console.log("Uid = "+uid);
			if(file_link){
				return res.status(201).json({
					success:1,
					msg:"successfull",
					fileUrl: file_link
				})
			}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:err
		})
	}
})

module.exports = app