const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    otp : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
	sent_at:{
		type : Date,
		required:true
	},
    verified:{
        type : Boolean,
        required : true,
        default : false
    }
})

const otp= mongoose.model('otp',otpSchema)
module.exports = otp