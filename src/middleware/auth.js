const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema")

const auth = async (req, res, next) => {
    try {
        // get cookie token
        const cToken = req.cookies.myJwt;
        // verify user
        const verifyUser = jwt.verify(cToken, process.env.SECRET_KEY)
        console.log(verifyUser);

        const user = await User.findOne({_id: verifyUser._id})
        console.log(user.username);
        console.log("Auth middleware2!")
        next()

    } catch (error) {
        res.render("login")
        // res.status(401).send(error)
    }
}

module.exports = auth;
