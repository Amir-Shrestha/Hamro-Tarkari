const UserModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const userRegistrationGet = (req, res) => {
  res.render("register");
}

const userRegistrationPost = async (req, res) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.cpassword;
    if (password === confirmPassword) {
      const registerUserObj = new UserModel({
        username: req.body.username,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password,
        role: "customer",
      });
      const tokenCreated = await registerUserObj.generateToken(); // midddleware to generate token.(hashing and saving is included here)
      res.cookie("myJwt", tokenCreated, { httpOnly: true }); // store token in cookies.
      res.status(201).redirect("dashboard");
    } else {
      console.log("Password and Confirm Password doesn't match !");
      res.render("register");
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send(error);
  }
}

const userLoginGet = (req, res) => {
  res.render("login");
}

const userLoginPost = async (req, res) => {
  try {
    const formEmail = req.body.email;
    const formPassword = req.body.password;
    const fetchedUserDocument = await UserModel.findOne({
      email: formEmail,
    });
    const passwordMatch = await bcrypt.compare(
      formPassword,
      fetchedUserDocument.password
    );

    if (passwordMatch) {
      console.log("Email and Password matched!");
      // midddleware to generate token.
      const tokenCreated = await fetchedUserDocument.generateToken();
      console.log('Hoi', tokenCreated)
      // store token in cookies.
      res.cookie("myJwt", tokenCreated, {
        httpOnly: true,
      });
      res.status(201).redirect("dashboard");
    } else {
      console.log("Email and Password not matched!");
      res.send("not logged");
    }
  } catch (error) {
    res.status(400).send("Invalid LogIn credentials!,", error);
  }
}

const userLogOut = async (req, res) => {
  try {
    res.clearCookie("myJwt"); //delete cookie token
    req.user.tokens = req.user.tokens.filter(
      (tokenObj) => tokenObj.token != req.cookieToken
    );
    await req.user.save(); //delete DB token
    console.log("Log Out !");
    res.redirect("login");
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = {
  userRegistrationGet,
  userRegistrationPost,
  userLoginGet,
  userLoginPost,
  userLogOut
}