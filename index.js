require('dotenv').config()


const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

const path=require("path");
const cookieParser = require('cookie-parser');

// const clientHost = `http://${process.env.CLIENT_HOST}`;
// console.log(clientHost);
app.use(express.json())
// const whitelist = ['http://localhost:3000', 'http://example2.com','https://main--stellular-monstera-299e0a.netlify.app/',clientHost];
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin, callback) => {
//     if(whitelist.includes(origin))
//       return callback(null, true)

//       callback(new Error('Not allowed by CORS'));
//   }
// }



const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');




// Cron job:
const cron = require('node-cron');
const axios = require('axios');
app.get('/',(req,res)=>{
    res.send('Test successful');
})
// Replace 'YOUR_SERVER_URL' with the actual URL of your server
// const serverUrl = 'https://tribe-backend-sl5g.onrender.com';
const serverUrl = 'http://localhost:8080/';

// Define the cron schedule (every 10 minutes)
axios.get(serverUrl).then((response)=>{console.log(response.data)})
cron.schedule('*/10 * * * *', () => {
    console.log('job running')
    axios.get(serverUrl).then((response)=>{console.log(response.data)})
});

app.use(cors({
    // origin:"https://tribein.netlify.app",
    origin:"http://localhost:3000",
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Origin','X-Requested-With','XMLHttpRequest','Accept', 'Authorization'],
    credentials: true,
}));
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

const createpost = require('./routes/user/create_post')
const fetch_links = require('./routes/user/fetch_links')
const postreaction = require('./routes/user/post_reactions')
const login = require('./routes/user/login')
const logout = require('./routes/user/logout')
const changepassword = require('./routes/user/change_password')
const delete_post = require('./routes/user/delete_post')
const delete_tribe_post = require('./routes/tribe/delete_tribe_post')
const email_otp = require('./routes/user/email_otp')
const fetch_tribe_post = require('./routes/tribe/fetch_tribe_post')
const fetch_tribe_users = require('./routes/tribe/fetch_tribe_users')
const fetch_tribes= require('./routes/user/fetch_tribes')
const createtribe = require('./routes/tribe/create_tribe')
const createtribepost = require('./routes/tribe/create_tribe_post')
const leave_tribe = require('./routes/tribe/leave_tribe')
const signup = require('./routes/user/signup')
const studentDetails = require('./routes/user/student_details')
const fetch_user_post = require('./routes/user/fetch_user_post')
const links = require('./routes/user/links')
const profile = require('./routes/user/profile')
const search = require('./routes/user/search')
const tribe_invite= require('./routes/tribe/tribe_invite')
// const uploadSingleFileAWS= require('./routes/user/uploadSingleFileAWS')
const fetch_post_by_uid = require('./routes/user/fetch_post_by_uid')
const fetch_notifications = require('./routes/user/fetch_notifications')

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
// app.use(uploadSingleFileAWS)


const swaggerOptions = {
    swaggerDefinition: {
        info: {
        title: 'Tribe - social media',
        description: 'Documentation for the backend API',
        contact: {
            name: "Abhishek",
        },
        servers: [`http://localhost:${PORT}`]
        }
    },
    apis: ["index.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Swagger definition
/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Login for all users
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Login user
 *        required: true
 *        example: {"user_id":"tempuser","password":"12345"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /logout:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: Logout user
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
*/

/**
 * @swagger
 * /changepassword:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: change password
 *    parameters:
 *      - in: body
 *        name: body
 *        description: change user password
 *        required: true
 *        example: {"email_id":"user@gmail.com","password":"123456","otp":"764437"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /createpost:
 *  post:
 *    tags:
 *      - Post
 *    summary: saving posts
 *    parameters:
 *      - in: body
 *        name: body
 *        description: saving posts to the database
 *        required: true
 *        example: {"user_id":"tempuser","text":"add text to the post","media_link":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /delete_post:
 *  post:
 *    tags:
 *      - Post
 *    summary: delete posts
 *    parameters:
 *      - in: body
 *        name: body
 *        description: saving posts to the database
 *        required: true
 *        example: {"user_id":"tempuser","posted_by":"tempuser","user_post_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /email_otp:
 *  post:
 *    tags:
 *      - OTP
 *    summary: send OTP to email
 *    parameters:
 *      - in: body
 *        name: body
 *        description: saving posts to the database
 *        required: true
 *        example: {"email_id":"user@gmail.com"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /email_otp_change_pwd:
 *  post:
 *    tags:
 *      - OTP
 *    summary: send OTP to email change password
 *    parameters:
 *      - in: body
 *        name: body
 *        description: saving posts to the database
 *        required: true
 *        example: {"email_id":"user@gmail.com"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /verify_otp:
 *  post:
 *    tags:
 *      - OTP
 *    summary: verify OTP
 *    parameters:
 *      - in: body
 *        name: body
 *        description: saving posts to the database
 *        required: true
 *        example: {"email_id":"user@gmail.com","otp":"123456"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /fetch_links:
 *  post:
 *    tags:
 *      - Links
 *    summary: send OTP to email
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find Links/connects 
 *        required: true
 *        example: {"user_id":"username","key":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /fetch_all_links_of:
 *  post:
 *    tags:
 *      - Links
 *    summary: send OTP to email
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find all Links/connects
 *        required: true
 *        example: {"user_id":"username","key":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_notifications:
 *  post:
 *    tags:
 *      - Links
 *    summary: Fetch notifications of user
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Fetch notifications for user
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_post_by_user:
 *  post:
 *    tags:
 *      - Post
 *    summary: Fetch posts of user
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Fetch posts for a user
 *        required: true
 *        example: {"user_id":"username","accToBeSearched":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /createtribe:
 *  post:
 *    tags:
 *      - Tribe
 *    summary: Tribe create
 *    parameters:
 *      - in: body
 *        name: body
 *        description: create tribe
 *        required: true
 *        example: {"user_id":"username","name":"","tribe_type":"","tribe_location":"","tags":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /delete_tribe_post:
 *  post:
 *    tags:
 *      - Tribe Post
 *    summary: Tribe - delete a post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: delete a tribe post
 *        required: true
 *        example: {"user_id":"username","posted_by":"","user_post_id":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_tribe_post:
 *  post:
 *    tags:
 *      - Tribe Post
 *    summary: Tribe - fetch a post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: delete a tribe post
 *        required: true
 *        example: {"user_id":"username","tribe_id":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_tribe_users:
 *  post:
 *    tags:
 *      - Tribe
 *    summary: Tribe - fetch a User
 *    parameters:
 *      - in: body
 *        name: body
 *        description: fetch a tribe user
 *        required: true
 *        example: {"user_id":"username","tribe_id":"0","count":"5"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /leave_tribe:
 *  post:
 *    tags:
 *      - Tribe
 *    summary: Tribe - Leave a tribe
 *    parameters:
 *      - in: body
 *        name: body
 *        description: leave a tribe 
 *        required: true
 *        example: {"user_id":"username","tribe_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /tribe_invite:
 *  post:
 *    tags:
 *      - Tribe Invite
 *    summary: Tribe - tribe invite
 *    parameters:
 *      - in: body
 *        name: body
 *        description: tribe invite 
 *        required: true
 *        example: {"user_id":"username","tribe_id":"0","receiver_id":"username2"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_tribe_invites:
 *  post:
 *    tags:
 *      - Tribe Invite
 *    summary: Tribe - fetch tribe invites
 *    parameters:
 *      - in: body
 *        name: body
 *        description: fetch tribe invites
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /response_tribe_invites:
 *  post:
 *    tags:
 *      - Tribe Invite
 *    summary: Tribe - response to tribe invite
 *    parameters:
 *      - in: body
 *        name: body
 *        description: tribe response choose true or false
 *        required: true
 *        example: {"user_id":"username","tribe_invite_id":"0","response_to_invite":"true"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /createtribepost:
 *  post:
 *    tags:
 *      - Tribe Post
 *    summary: Tribe - create a post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: create a post in tribe, media_link is the link to the media
 *        required: true
 *        example: {"user_id":"username","tribe_id":"","text":"","media_link":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /delete_tribe:
 *  post:
 *    tags:
 *      - Tribe
 *    summary: Tribe delete
 *    parameters:
 *      - in: body
 *        name: body
 *        description: delete the tribe
 *        required: true
 *        example: {"user_id":"username","tribe_id":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /search_tribe:
 *  post:
 *    tags:
 *      - Tribe
 *    summary: Tribe find
 *    parameters:
 *      - in: body
 *        name: body
 *        description: find a tribe, term is the search term, count is the number of results to be shown
 *        required: true
 *        example: {"user_id":"username","term":"","count":"0","tribe_id":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_tribes:
 *  post:
 *    tags:
 *      - Tribe
 *    summary: Tribe find
 *    parameters:
 *      - in: body
 *        name: body
 *        description: fetch tribes
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_user_post:
 *  post:
 *    tags:
 *      - Post
 *    summary: find posts of the users
 *    parameters:
 *      - in: body
 *        name: body
 *        description: find posts of the users
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_post_by_id:
 *  post:
 *    tags:
 *      - Post
 *    summary: find a particular post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: find a particular post
 *        required: true
 *        example: {"user_id":"username","post_owner":"username","user_post_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /sendlinkrequest:
 *  post:
 *    tags:
 *      - Links
 *    summary: Request to connect with a user
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Request to connect with a user, receiver_user_id is the user to whom the request is to be sent
 *        required: true
 *        example: {"user_id":"username","receiver_user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /upvote:
 *  post:
 *    tags:
 *      - Post Reaction
 *    summary: Upvote a post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Upvote a post, posted_by is the user who posted the post, user_post_id is the post id
 *        required: true
 *        example: {"user_id":"username","posted_by":"username","user_post_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetch_upvotes_of_user:
 *  post:
 *    tags:
 *      - Post Reaction
 *    summary: Upvoted posts
 *    parameters:
 *      - in: body
 *        name: body
 *        description: find all upvoted posts of a user
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /getupvotedby:
 *  post:
 *    tags:
 *      - Post Reaction
 *    summary: Upvotes for a post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: get all the upvotes for a post
 *        required: true
 *        example: {"user_id":"username","posted_by":"username","user_post_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /comment:
 *  post:
 *    tags:
 *      - Post Reaction - comments
 *    summary: comment on a post
 *    parameters:
 *      - in: body
 *        name: body
 *        description: user_post_id is the post id, parent_comment_id is the id of the parent comment, text is the comment text
 *        required: true
 *        example: {"user_id":"username","post_by_user_id":"username","user_post_id":"0","parent_comment_id":"0","text":"comment text"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /likepostcomment:
 *  post:
 *    tags:
 *      - Post Reaction - comments
 *    summary: like a post's comment
 *    parameters:
 *      - in: body
 *        name: body
 *        description: _id is the comment id
 *        required: true
 *        example: {"user_id":"username","_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

/**
 * @swagger
 * /fetchpostcomment:
 *  post:
 *    tags:
 *      - Post Reaction - comments
 *    summary: fetch a post's comment
 *    parameters:
 *      - in: body
 *        name: body
 *        description: fetch a post's comment, user_post_id is the post id
 *        required: true
 *        example: {"user_id":"username","post_by_user_id":"0","user_post_id":"0","entries_required":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /deletepostcomment:
 *  post:
 *    tags:
 *      - Post Reaction - comments
 *    summary: delete a post's comment
 *    parameters:
 *      - in: body
 *        name: body
 *        description: delete a post's comment, _id is the comment id
 *        required: true
 *        example: {"user_id":"username","_id":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /editstudentDetails:
 *  post:
 *    tags:
 *      - Student Details
 *    summary: Fetch student details
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Edit your student details
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /studentDetails:
 *  post:
 *    tags:
 *      - Student Details
 *    summary: Set your student details
 *    parameters:
 *      - in: body
 *        name: body
 *        description: student details
 *        required: true
 *        example: {"user_id":"username","name":"name","about":"add details about you","dob":"2021-06-01","home_city":"city","college":"college","pass_out_year":"2021","course":"course","job":"job","interests":"interests"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /fetchstudentDetails:
 *  post:
 *    tags:
 *      - Student Details
 *    summary: Edit student details
 *    parameters:
 *      - in: body
 *        name: body
 *        description: fetch a student's details
 *        required: true
 *        example: {"user_id":"username"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /find:
 *  post:
 *    tags:
 *      - Search
 *    summary: Search for a user
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find a user
 *        required: true
 *        example: {"user_id":"username","key":""}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /search_user_id:
 *  post:
 *    tags:
 *      - Search
 *    summary: Search for a userid times
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find a user by userid
 *        required: true
 *        example: {"user_id":"username","key":"abh","noOfValues":"0"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /search:
 *  post:
 *    tags:
 *      - Search
 *    summary: Search
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find 
 *        required: true
 *        example: {"user_id":"username","key":"uni","noOfValues":"10"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /search_val:
 *  post:
 *    tags:
 *      - Search
 *    summary: Search by value
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find by value
 *        required: true
 *        example: {"user_id":"username","key":"uni","noOfValues":"10"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /search_val_by_type:
 *  post:
 *    tags:
 *      - Search
 *    summary: Search student by value
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find by value by type: name, email, job, course, college, home_city, about, interests, tribe, tribe_type
 *        required: true
 *        example: {"user_id":"username","key":"uni","type":"name","noOfValues":"10"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /search_post_by_type:
 *  post:
 *    tags:
 *      - Search
 *    summary: Search post by value
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Find by value by type: name, text
 *        required: true
 *        example: {"user_id":"username","key":"uni","type":"name","noOfValues":"10"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */
/**
 * @swagger
 * /signup:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Signup for users
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Signup for user
 *        required: true
 *        example: {"user_id":"username","email":"user@gmail.com","phone":"","password":"12345"}
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */

app.listen(process.env.PORT||PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`)
})