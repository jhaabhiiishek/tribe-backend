const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
	about:{
		type:String,
		required:false
	},
	dob :{
		type: Date,
		required: true
	},
	home_city :{
		type: String
	},
	college :{
		type: String,
		required: true
	},
	pass_out_year :{
		type: Number,
		required: true
	},
	course :{
		type: String,
		required: true
	},
	job :{
		type: String,
		required: true
	},
	user_id :{
		type: String,
		required: true
	},
	email :{
		type: String,
		required: true
	},
	interests :{
		type: Array,
		required: true
	},
	links :{
		type: Array,
		required: false
	},
    phone : {
        type : Number,
        required : false
    },
	tribes :{
		type : Array,
		required : false
	}
})

const student = mongoose.model('student',studentSchema)
module.exports = student