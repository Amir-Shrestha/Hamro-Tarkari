const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")

const logAuth = async (req, res, next) => {
    try {
        const cookieToken = req.cookies.myJwt; // get cookie token
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY)
        const user = await User.findOne({_id: verifyToken._id})
        console.log(`You are aleardy Logged in and Authenticated! ${user.email}`)
        if(user.role == "Admin"){
            res.status(201).redirect("/dashboard");
        }else if(user.role == "Client"){
            console.log("Hi")
            res.status(201).redirect("/profile");
        }else{
            next()
        }
    } catch (error) {
        console.log("********* No jwt found in cookie. Credential Form")
        next()
    }
}

const adminAuth = async (req, res, next) => {
    try {
        // console.log(req.cookies.myJwt)
        const cookieToken = req.cookies.myJwt; // get cookie token
        // console.log(req.cookies.myJwt)
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY) // verify user
        // console.log(req.cookies.myJwt)
        const user = await User.findOne({_id: verifyToken._id})
        if(user.role == "Admin"){
            next()
        }else{
            res.redirect("/");
        }
    } catch (error) {
        console.log('Login First!')
        res.render("login", {cookieUserToken:"", msg: ""})
    }
}

const clientAuth = async (req, res, next) => {
    try {
        // console.log(req.cookies.myJwt)
        const cookieToken = req.cookies.myJwt; // get cookie token
        // console.log(req.cookies.myJwt)
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY) // verify user
        // console.log(req.cookies.myJwt)
        const user = await User.findOne({_id: verifyToken._id})
        if(user.role == "Client"){
            next()
        }else{
            res.redirect("/");
        }
    } catch (error) {
        console.log('Login First!')
        res.render("login", {cookieUserToken:"", msg: ""})
    }
}

const roleAuth = async (req, res, next) => {
    try {
        // console.log(req.cookies.myJwt)
        const cookieToken = req.cookies.myJwt; // get cookie token
        // console.log(req.cookies.myJwt)
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY) // verify user
        // console.log(req.cookies.myJwt)
        const user = await User.findOne({_id: verifyToken._id})
        if(user!= null){
            next()
        }else{
            res.render("/");
        }
    } catch (error) {
        console.log('Login First!')
        res.render("login", {cookieUserToken:"", msg: ""})
    }
}

module.exports = {
    logAuth,
    adminAuth,
    clientAuth,
    roleAuth
};
