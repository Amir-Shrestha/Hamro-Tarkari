const bcrypt = require("bcryptjs");

const UserModel = require("../models/userSchema");
const ProductModel = require("../models/productSchema");

const userRegistrationGet = async (req, res) => {
  res.render("register", { msg: ""});
};

const userRegistrationPost = async (req, res) => {
  const user = await UserModel.findOne({email: req.body.email})
  if( user != null){
      console.log("Invalid Email !")
      res.render("register", {msg: "Invalid Email !"})
      return
  }
  try {
    const registerUserObj = new UserModel({
      username: req.body.username,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
      password: req.body.password
    });
    const tokenCreated = await registerUserObj.generateToken(); // midddleware to generate token.(hashing and saving is included here)
    res.cookie("myJwt", tokenCreated, { httpOnly: true }); // store token in cookies.
     // local storage user-detials
    if(registerUserObj.role == "Admin"){
      res.status(201).redirect("/dashboard");
    }else if(registerUserObj.role == "Client"){
      res.status(201).redirect("/profile");
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send(error);
  }
};

const userLoginGet = async (req, res) => {
  res.render("login", { msg: ""});
};

const userLoginPost = async (req, res) => {
  try {
    const formEmail = req.body.email;
    const formPassword = req.body.password;
    const fetchedUserDocument = await UserModel.findOne({
      email: formEmail,
    });
    if(fetchedUserDocument){
      const passwordMatch = await bcrypt.compare(
        formPassword,
        fetchedUserDocument.password,
        );
      if (passwordMatch) {
        console.log("Email and Password matched!");
        // midddleware to generate token.
        const tokenCreated = await fetchedUserDocument.generateToken();
        console.log(tokenCreated)

        // store token and user-id in cookies.
        res.cookie("myJwt", tokenCreated, { httpOnly: true });

        res.status(201).redirect("dashboard");
      }
    } else {
        console.log("Email and Password not matched!");
        res.render("login", {msg: "Email and Password not matched!"});
      }
  } catch (error) {
    res.status(400).send("Invalid LogIn credentials!," + error);
  }
};

const userLogOut = (req, res) => {
  try {
    console.log("Log Out !");
    res.clearCookie("myJwt"); //delete cookie token
    console.log("Log Out !");
    res.redirect("login");
  } catch (error) {
    res.status(400).send(error);
  }
};

const addCategoryGet = async (req, res) => {
  res.render("add_Category", {msg: ""})
}

const addCategoryPost = async (req, res) => {
  const productObj = new ProductModel({
    product_name: req.body.product_name,
    rate: req.body.rate,
    description: req.body.description,
    views: 0,
    image: "/images/uploadedImages/"+req.file.filename
  });
  await productObj.save();
  console.log("Category Added!");
  res.redirect("/");
};

const addTarkariGet = async (req, res) => {
  res.render("add_tarkari", {msg: ""})
}

const addTarkariPost = async (req, res) => {
  const productObj = new ProductModel({
    product_name: req.body.product_name,
    rate: req.body.rate,
    description: req.body.description,
    views: 0,
    image: "/images/uploadedImages/"+req.file.filename
  });
  await productObj.save();
  console.log("Tarkari Added!");
  res.redirect("/");
};

const dashBoard = async (req, res) => {
  const products = await ProductModel.find();
  res.render("dashboard", {products});
}

const profile = (req, res) => {
  res.render("profile");
}

const deleteTarkariPost = async (req, res) => {
  await ProductModel.deleteOne({_id:req.params.pid });
  res.redirect("/dashboard")
}

const updateTarkariGet = async (req, res) => {
  const product = await ProductModel.findOne({_id: req.params.pid});
  res.render("update_tarkari", {product: product, msg: ""})
}

const updateTarkariPut = async (req, res) => {
  const product = await ProductModel.findByIdAndUpdate(req.params.pid, {
    product_name: req.body.product_name,
    rate: req.body.rate,
    description: req.body.description
  });
  if(req.file){
    product.image = "/images/uploadedImages/" + req.file.filename
  }
  await product.save();
  res.redirect("/dashboard");
}

module.exports = {
  userRegistrationGet,
  userRegistrationPost,
  userLoginGet,
  userLoginPost,
  userLogOut,
  addTarkariGet,
  addTarkariPost,
  dashBoard,
  profile,
  deleteTarkariPost,
  updateTarkariGet,
  updateTarkariPut
};
