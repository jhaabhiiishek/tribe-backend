const mongoose = require('mongoose')

const premiumSchema = new mongoose.Schema({
	user_id :{
		type: String,
		required: true
	},
    startDate : {
        type : Date,
        required : true
    },
	endDate:{
		type:String,
		required:true
	},
	paymentId : {
		type : String,
		required : true
	},
	paymentDate : {
		type : Date,
		required : true
	}
})

const premium = mongoose.model('premium',premiumSchema)
module.exports = premium