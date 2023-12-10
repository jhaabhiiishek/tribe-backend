const LocalStrategy = require('passport-local').Strategy;
const authenticate = require('../auth/authentication')
const post = require('../modules/post')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const login_creds = require('../modules/login_creds')

const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_KEY = process.env.TOKEN_KEY;

const verifyToken = async (req, res, next) => {

    if (!req.cookies["student"]) {
        return res.status(203).send("You are not logged in");
    }
    try {
        console.log("Token Verification started.....")
        const final_token = req.cookies["student"];
        
        if (typeof (final_token) == "string") {
            token = final_token
        } else {
            token = final_token.token
        }
        var verified_user_id = null;
        const verified = jwt.verify(token, TOKEN_KEY, async (err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.clearCookie("student");
                    return res.status(203).json({
                        success: 0,
                        error: "Your session was timeout. Please login again",
                    });
                }
            } else {
                if (decoded.token_last == true) {
                    return res.status(203).json({
                        success: 0,
                        message: "Internal Server Error"
                    });
                }
                verified_user_id = decoded.user_id;
                if(req.body.user_id&&(req.body.user_id!=verified_user_id)){
                    return res.status(203).json({
                        success: 0,
                        message: "Bad request made"
                    });
                }
            }
            console.log("Token Verification ended.....")
            next()
        });
    } catch (error) {
        console.log(error)
        return res.status(203).json({
            success: 0,
            error: "Invalid Token",
        });
    }
};

module.exports = verifyToken;