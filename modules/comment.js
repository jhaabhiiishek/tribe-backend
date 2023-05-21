const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    made_by_user_id : {
        type : String,
        required : true
    },
    post_by_user_id:{
        type : String,
        required:true
    },
    user_post_id : {
        type : Number,
        required : true
    },
	upvotes:{
		type: Number,
		required:false,
		default:0
	},
	child_comment_id : {
        type : Array,
        required : false
    },
	text : {
        type : String,
        required : false
    },
	upload_date:{
		type : String,
		required:true
    },
    parent_comment_id : {
        type : String,
		required:false
    }
})

const comment = mongoose.model('comment',commentSchema)
module.exports = comment