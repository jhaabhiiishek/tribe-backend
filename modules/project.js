const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    user_project_id:{
        type : Number,
        required:true
    },

    upvotes : {
        type : Number,
		default: 0,
        required : false
    },
    upvoted_by : {
        type : Array,
		default: 0,
        required : false
    },
	project_name : {
        type : String,
        required : false
    },

	project_type : {
        type : String,
		default: false,
        required : true
    },
	project_link : {
        type : String,
        required : false
    },
	upload_date:{
		type : Date,
		required:true
    }
})

const project = mongoose.model('project',projectSchema)
module.exports = project