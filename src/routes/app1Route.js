const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const validation = require("../middleware/validation");
const upload = require("../middleware/imageUpload");
const appContoller = require("../controllers/app1Controller")
const ProductModel = require("../models/productSchema");

router.get("/", async (req, res) => {
  const products = await ProductModel.find();
  const username = "Amir";
  params = {products, username}
  res.render("home", params);
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/service", (req, res) => {
  res.render("service");
});

// Usre Registration
router
  .route("/register")
  .get(authentication.logAuth, appContoller.userRegistrationGet)
  .post(authentication.logAuth, validation, appContoller.userRegistrationPost);

// User LogIn
router
  .route("/login")
  .get(authentication.logAuth, appContoller.userLoginGet)
  .post(authentication.logAuth, appContoller.userLoginPost);

router.get("/dashboard", authentication.auth, appContoller.dashBoard);

router.get("/innerpage", authentication.auth, (req, res) => {
  res.send("<h1>Innerpage</h1> <a href='/dashboard'>DashBoard</a>");
});

// User LogOut
router.get("/logout", authentication.auth, appContoller.userLogOut);

//Post CRUD
router.get("/add_tarkari", appContoller.addTarkariGet)
router.post("/add_tarkari", upload, appContoller.addTarkariPost)

module.exports = router;
