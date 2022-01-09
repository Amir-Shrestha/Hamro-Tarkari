const User = require("../models/userSchema");

const validation = async (req, res, next) => {
    const formMobile = req.body.mobile
    const formPassword = req.body.password;
    const formConfirmPassword = req.body.cpassword;
    const formEmail = req.body.email;

    const user = await User.findOne({email: formEmail})
    if(user){
        console.log("Invalid Email !")
        res.redirect("/register")
    }

    if(formMobile.match(/^\d{10}$/) === null){
        console.log("Mobile number must have exact 10 integers !")
        res.redirect("/register")
    }

    if(formPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/) === null){
        console.log("Password must have 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter !")
        res.redirect("/register")
    }

    if(formPassword != formConfirmPassword){
        console.log("Password and Confirm Password doesn't match !")
        res.redirect("/register")
    }
    next()
}

module.exports = validation