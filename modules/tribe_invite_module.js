const mongoose = require('mongoose')
const tribe_inviteSchema = new mongoose.Schema({
    tribe_id:{
        type : Number,
        required:true
    },
    tribe_name:{
        type : String,
        required:true
    },
    sender:{
        type : String,
        required:true
    },
    receiver : {
        type : String,
        required : true
    },
	sent_at : {
        type : Date,
        required : false
    }
})

const tribeinvite = mongoose.model('tribeinvite',tribe_inviteSchema)
module.exports = tribeinvite