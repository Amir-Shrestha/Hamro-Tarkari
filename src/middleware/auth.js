const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")

const auth = async (req, res, next) => {
    try {
        // get cookie token
        const cookieToken = req.cookies.myJwt;
        // verify user
        const verifyToken = jwt.verify(cookieToken, process.env.SECRET_KEY)
        console.log('this ',verifyToken);

        const user = await User.findOne({_id: verifyToken._id})
        // console.log(user.username);

        req.cookieToken = cookieToken;
        req.user = user;

        next()

    } catch (error) {
        res.render("login")
        // res.status(401).send(error)
        console.log('Logout ', error)
    }
}

module.exports = auth;
