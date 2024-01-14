const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true
    },
    type:{
        type : String,
        required:true
    },
	action_performed_by:{
		type : String,
		required : true
	},
	action_on_post_id : {
        type : String,
        required : true
    }
	// media_link : {
    //     type : String,
    //     required : false
    // },
})

const notifications = mongoose.model('notifications',notificationSchema)
module.exports = notifications