const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
    sender_user_id : {
        type : String,
        required : true
    },
    receiver_user_id : {
        type : String,
        required : true
    },
	sent_at:{
		type : Date,
		required:true
	},
})

const link = mongoose.model('link',linkSchema)
module.exports = link