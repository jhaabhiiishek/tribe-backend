require('dotenv').config()


const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const path=require("path");
const cookieParser = require('cookie-parser');

app.use(express.json())
const whitelist = ['http://localhost:3000', 'http://example2.com','*'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended:true
}))

const PORT = 8080

const DB = process.env.MONGOCOMMAND
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log('Database connected..')
})


const login_creds = require('./modules/login_creds')
const comments = require('./modules/comment')
const createpost = require('./routes/create_post')
const fetch_links = require('./routes/fetch_links')
const postreaction = require('./routes/post_reactions')
const login = require('./routes/login')
const logout = require('./routes/logout')
const changepassword = require('./routes/change_password')
const delete_post = require('./routes/delete_post')
const delete_tribe_post = require('./routes/delete_tribe_post')
const email_otp = require('./routes/email_otp')
const fetch_tribe_post = require('./routes/fetch_tribe_post')
const fetch_tribe_users = require('./routes/fetch_tribe_users')
const fetch_tribes= require('./routes/fetch_tribes')
const createtribe = require('./routes/create_tribe')
const createtribepost = require('./routes/create_tribe_post')
const leave_tribe = require('./routes/leave_tribe')
const signup = require('./routes/signup')
const studentDetails = require('./routes/student_details')
const fetch_user_post = require('./routes/fetch_user_post')
const links = require('./routes/links')
const profile = require('./routes/profile')
const search = require('./routes/search')
const tribe_invite= require('./routes/tribe_invite')
// const uploadSingleFile= require('./routes/uploadSingleFile')
const fetch_post_by_uid = require('./routes/fetch_post_by_uid')
const fetch_notifications = require('./routes/fetch_notifications')

app.use(changepassword)
app.use(createpost)
app.use(createtribepost)
app.use(createtribe)
app.use(delete_post)
app.use(delete_tribe_post)
app.use(fetch_notifications)
app.use(email_otp)
app.use(fetch_tribe_post)
app.use(fetch_tribe_users)
app.use(fetch_tribes)
app.use(fetch_user_post)
app.use(leave_tribe)
app.use(links)
app.use(login)
app.use(logout)
app.use(fetch_post_by_uid)
app.use(fetch_links)
app.use(postreaction)
app.use(profile)
app.use(search)
app.use(signup)
app.use(studentDetails)
app.use(tribe_invite)
// app.use(uploadSingleFile)



app.listen(process.env.PORT||PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`)
})