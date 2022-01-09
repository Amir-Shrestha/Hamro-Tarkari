const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")

const logAuth = async (req, res, next) => {
    try {
        const cookieToken = req.cookies.myJwt; // get cookie token
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY)
        console.log(` Aunthenticated User1: ${verifyToken}`)
        console.log('You are aleardy Logged in and Authenticated!')
        res.render("dashboard")
    } catch (error) {
        console.log("Credential Form")
        next()
    }
}

module.exports = logAuth;
