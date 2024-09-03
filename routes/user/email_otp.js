require('dotenv').config()
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const nodemailer= require('nodemailer');
const login_creds = require('../../modules/login_creds')
const otp_mod = require('../../modules/otp')
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());

app.post('/email_otp',async function(req,res){
	try{
		const {
			email_id
		}= req.body;
		
		if(email_id==null||email_id==undefined){
			return res.status(203).json({
				success:0,
				msg:"Enter email"
			})
		}
		const email_check = await login_creds.findOne({
			email: email_id
		})
		if(email_check!=null||email_check!=undefined){
			return res.status(203).json({
				success:0,
				msg:"Email Already registered, login instead!"
			})
		}



		let transporter = nodemailer.createTransport({
			service:"gmail",
			auth:{
				user:process.env.LMNTOPQ,
				pass:process.env.WHAT,
			},
			tls:{
				rejectUnauthorized:false,
			}
		})
		function generateOTP(){
			let OTP = '';
			var digits = '0123456789';
			for (let i = 0; i < 6; i++ ) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}
			return OTP;
		}
		
		let otp_string = '';
		otp_string = generateOTP();
		console.log(otp_string)
		let text_msg = "Your OTP for login is :"+otp_string;
		let subject= "Tribe Login OTP!";
		let mailOptions = {
			from:process.env.LMNTOPQ,
			to:email_id,
			subject:subject,
			text: text_msg
		}
		console.log(mailOptions)
		const otp_entered = await otp_mod.findOne({
			email : email_id
		})
		console.log(otp_entered)
		var new_otp
		if(otp_entered==null||otp_entered==undefined){
			new_otp = await otp_mod.create({
				email : email_id,
				otp : otp_string,
				sent_at : new Date(),
				verified:false
			})
		}
		else{
			console.log("yhapehai")
			new_otp = await otp_mod.updateOne({
				email : email_id,
			},{
				otp : otp_string,
				sent_at : new Date()
			})
		}
		if(new_otp==undefined||new_otp==null){
			console.log("yha pehai")
			return res.status(203).json({
				success:0,
				msg : ' Can not send otp currently'
			})
		}
		console.log("yha pe hai")
		await new Promise((resolve, reject) => {
			transporter.verify(function (error, success) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log("Server ready");
					resolve(success);
				}
			});
		});
		console.log("yha wtf hai")
		const success = await new Promise(() => {
			// send mail
			transporter.sendMail(mailOptions,function(err, success){
				if(err){
					console.log(err)
				}else{
					console.log("Email sent successfully!!")
					return res.status(201).json({
						success:1,
						msg : 'Sent successfully'
					})
				}
			})
		})
	}catch(err){
		return res.status(203).json({
			success:0,
			msg : 'Can not send',
			data: err
		})
	}
})

app.post('/email_otp_change_pwd',async function(req,res){
	try{
		const {
			email_id
		}= req.body;
		
		if(email_id==null||email_id==undefined){
			return res.status(203).json({
				success:0,
				msg:"Enter email"
			})
		}



		let transporter = nodemailer.createTransport({
			service:"gmail",
			auth:{
				user:process.env.LMNTOPQ,
				pass:process.env.WHAT,
			},
			tls:{
				rejectUnauthorized:false,
			}
		})
		function generateOTP(){
			let OTP = '';
			var digits = '0123456789';
			for (let i = 0; i < 6; i++ ) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}
			return OTP;
		}
		
		let otp_string = '';
		otp_string = generateOTP();
		console.log(otp_string)
		let text_msg = "Your OTP for login is :"+otp_string;
		let subject= "Tribe Login OTP!";
		let mailOptions = {
			from:process.env.LMNTOPQ,
			to:email_id,
			subject:subject,
			text: text_msg
		}
		console.log(mailOptions)
		const otp_entered = await otp_mod.findOne({
			email : email_id
		})
		console.log(otp_entered)
		var new_otp
		if(otp_entered==null||otp_entered==undefined){
			new_otp = await otp_mod.create({
				email : email_id,
				otp : otp_string,
				sent_at : new Date(),
				verified:false
			})
		}
		else{
			console.log("yhapehai")
			new_otp = await otp_mod.updateOne({
				email : email_id,
			},{
				otp : otp_string,
				sent_at : new Date()
			})
		}
		if(new_otp==undefined||new_otp==null){
			console.log("yha pehai")
			return res.status(203).json({
				success:0,
				msg : ' Can not send otp currently'
			})
		}
		console.log("yha pe hai")
		await new Promise((resolve, reject) => {
			transporter.verify(function (error, success) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log("Server ready");
					resolve(success);
				}
			});
		});
		console.log("yha wtf hai")
		const success = await new Promise(() => {
			// send mail
			transporter.sendMail(mailOptions,function(err, success){
				if(err){
					console.log(err)
				}else{
					console.log("Email sent successfully!!")
					return res.status(201).json({
						success:1,
						msg : 'Sent! Check your email'
					})
				}
			})
		})
	}catch(err){
		return res.status(203).json({
			success:0,
			msg : 'Can not send',
			data: err
		})
	}
})


app.post('/verify_otp',async function(req,res){
	try{
		const {
			email_id,
			otp
		}= req.body;
		
		if(!(email_id&&otp)){
			return res.status(203).json({
				success :0,
				msg:"Enter email & otp"
			})
		}
		const email_check = await login_creds.findOne({
			email: email_id
		})
		if(email_check!=null||email_check!=undefined){
			return res.status(203).json({
				success :0,
				msg:"Email Already registered, login instead!"
			})
		}
		
		const otp_entered = await otp_mod.findOne({
			email : email_id
		})
		console.log("Check 1")
		if(otp_entered==null||otp_entered==undefined){
			console.log("Check 2")
			return res.status(203).json({
				success :0,
				msg :" Can not find the given email"
			})
		}
		else{
			console.log("Check 3")
			function checkIfFifteenMinutesHavePassed(someDate) {
				const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
				const currentDate = new Date();
				const elapsedTime = currentDate - someDate;
				return elapsedTime >= fifteenMinutesInMilliseconds;
			}
			if(checkIfFifteenMinutesHavePassed(otp_entered.sent_at)){
				console.log("Check 4")
				return res.status(204).json({
					success :0,
					msg :"Your OTP is no longer valid",
				})
			}
			if(otp_entered.otp==otp){
				const new_otp = await otp_mod.updateOne({
					email : email_id,
				},{
					verified : true
				})
				return res.status(201).json({
					success :1,
					msg :" Successfully verified email, now signup",
				})
			}
			return res.status(203).json({
				success :0,
				msg :" Wrong OTP entered",
			})
		}
	}catch(err){
		return res.status(203).json({
			msg : 'Can not verify',
			data: err
		})
	}
})


module.exports= app