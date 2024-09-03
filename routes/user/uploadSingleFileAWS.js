const post = require('../../modules/post')
const express = require('express')
const authenticate = require('../../auth/authentication')
const app = express()
const multer = require('multer')
var uuid = require("uuid");
const storage = require('../../modules/firebase')

// const aws = require('aws-sdk');

// var organization_id = 'tribebyabhishek';
// var s3 = new aws.S3({
//     region:process.env.REGION,
//     accessKeyId:process.env.ACCESS_KEY,
//     secretAccessKey:process.env.ACCESS_SECRET
// });
var upload = multer({ storage: multer.memoryStorage() })

app.post('/uploadSingleFile',[authenticate,upload.single('file')],async(req,res)=>{

	try{
		const{
			user_id
		} = req.body
		
			if(!(user_id)||!req.file){
				return res.status(203).json({
					success:0,
					msg:"The file can not be empty"
				})
			}
	
			// console.log("here-in file upload")
			// console.log(req.file)
			// console.log(req.body)
			
			// firstpart=req.file.originalname.substring(0,req.file.originalname.lastIndexOf('.'))
			// lastpart=req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))
			// uniqueId = uuid.v4();	
			// uid = uniqueId;
			// console.log("Uid = "+uid);
			// file_link = "https://"+organization_id+".s3.amazonaws.com/"+user_id+'/'+firstpart+uid+lastpart;
			// console.log("Uid = "+uid);
			
			// const params ={
			// 	Bucket: organization_id,
			// 	Key:user_id+'/'+firstpart+uid+lastpart,
			// 	Body: req.file.buffer,
			// 	ContentType: req .file.mimetype,
			// 	ACL:'public-read'
			// }
			// console.log("Uid = "+uid);
			
			// await s3.putObject(params,(error,success)=>{
			// 	if(error){
			// 		console.log(error)
			// 	}
			// 	console.log(success)
			// })
			// console.log(file_link)
			// console.log("Uid = "+uid);
			// if(file_link){
			// 	return res.status(201).json({
			// 		success:1,
			// 		msg:"successfull",
			// 		fileUrl: file_link
			// 	})
			// }


			const file = req.file; // Get uploaded file from request
			const filename = `${user_id}/${uuid.v4()}.${file.originalname.split('.').pop()}`; // Generate unique filename
			const storageRef = ref(storage, filename); // Create a reference to the storage location

			const upload = await uploadBytes(storageRef, file.buffer); // Upload the file to Firebase Storage

			if(upload){
				const downloadUrl = await getDownloadURL(storageRef); // Get the download URL for the uploaded file
				console.log(downloadUrl)
				return res.status(201).json({ 
					success: 1, 
					msg: "Successful", 
					fileUrl: downloadUrl 
				});
			}else{
				return res.status(204).json({ 
					success: 0, 
					msg: "Failed",
				});
			}
	}catch(err){
		return res.status(203).json({
			success:0,
			msg:err
		})
	}
})

module.exports = app