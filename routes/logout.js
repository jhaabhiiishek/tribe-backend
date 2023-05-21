const post = require('../modules/post')
const express = require('express')
const app = express()
const passport = require('passport')

app.get('/logout', function(req, res) {
	try {
        res.clearCookie("student");
        return res.status(200).json({
            success: 1,
            msg: "Logged out successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(203).json({
            success: 0,
            msg: "Unable to logout"
        });
    }
});
module.exports= app