const mongoose = require('mongoose')
const tribeSchema = new mongoose.Schema({
    tribe_id:{
        type : Number,
        required:true
    },
    creator:{
        type : String,
        required:true
    },
    name : {
        type : String,
        required : true
    },
	members : {
        type : Array,
        required : false
    },
	tribe_type : {
        type : String,
        required : true
    },
	posts : {
        type : Array,
        required : false
    },
})

const tribe = mongoose.model('tribe',tribeSchema)
module.exports = tribe