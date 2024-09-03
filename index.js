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
const serverUrl = 'https://tribe-backend-sl5g.onrender.com';

// Define the cron schedule (every 10 minutes)
axios.get(serverUrl).then((response)=>{console.log(response.data)})
cron.schedule('*/10 * * * *', () => {
    console.log('job running')
    axios.get(serverUrl).then((response)=>{console.log(response.data)})
});

app.use(cors({
    origin:"https://tribein.netlify.app",
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
        title: 'Movie Booking Backend',
        description: 'Movie booking Backend Documentation',
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
 *        example: {"user_id":"user@gmail.com","password":"123456"}
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
 * /uploadSingleFile:
 *  post:
 *    tags:
 *      - File
 *    summary: Add movie to the database
 *    parameters:
 *      - in: formData
 *        name: user_id
 *        description: "Give your userId"
 *        required: true
 *      - in: formData
 *        name: file
 *        description: File
 *        required: true
 *        type: file
 *    responses:
 *      '200':
 *        description: Success
 *      '203':
 *        description: failure
 */





app.listen(process.env.PORT||PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`)
})