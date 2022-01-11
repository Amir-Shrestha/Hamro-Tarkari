const bcrypt = require("bcryptjs");

const UserModel = require("../models/userSchema");
const ProductModel = require("../models/productSchema");

const userRegistrationGet = (req, res) => {
  res.render("register");
};

const userRegistrationPost = async (req, res) => {
  try {
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
    res.status(201).redirect("/dashboard");
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send(error);
  }
};

const userLoginGet = (req, res) => {
  res.render("login");
};

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
};

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
};

const addTarkariGet = (req, res) => {
  res.render("add_tarkari")
}

const addTarkariPost = async (req, res) => {
  console.log(req.file.filename)
  const productObj = new ProductModel({
    product_name: req.body.product_name,
    rate: req.body.rate,
    description: req.body.description,
    views: 0,
    image: "images/uploadedImages/"+req.file.filename
  });
  await productObj.save();
  console.log("Tarkari Added!");
  res.redirect("/");
};

const dashBoard = async (req, res) => {
  const products = await ProductModel.find();
  const username = req.user.username;
  params = {products, username}
  res.render("dashboard", params);
}

module.exports = {
  userRegistrationGet,
  userRegistrationPost,
  userLoginGet,
  userLoginPost,
  userLogOut,
  addTarkariGet,
  addTarkariPost,
  dashBoard
};
