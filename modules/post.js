const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true
    },
    user_post_id:{
        type : Number,
        required:true
    },
    upvotes : {
        type : Number,
		default: 0,
        required : false
    },
	tags : {
        type : Array,
        required : false
    },
	upvoted_by : {
        type : Array,
        required : false
    },
	is_tribe : {
        type : Boolean,
		default: false,
        required : true
    },
	text : {
        type : String,
        required : false
    },
	// media_link : {
    //     type : String,
    //     required : false
    // },
	upload_date:{
		type : Date,
		required:true
    },
    comment_id:{
        type:Array,
        required:false
    }
})

const post = mongoose.model('post',postSchema)
module.exports = post