const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")

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

module.exports = auth;
