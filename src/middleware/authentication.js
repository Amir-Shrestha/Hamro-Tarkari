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

const auth = async (req, res, next) => {
    try {
        const cookieToken = req.cookies.myJwt; // get cookie token
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY) // verify user
        const user = await User.findOne({_id: verifyToken._id})
        console.log(` Aunthenticated User2: ${user.username}`)

        // req.cookieToken and req.user is send to next route.
        req.cookieToken = cookieToken;
        req.user = user;
        next()
    } catch (error) {
        console.log('Login First!')
        res.render("login")
    }
}

module.exports = {
    logAuth,
    auth
};
