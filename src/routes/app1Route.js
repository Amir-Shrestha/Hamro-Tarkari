const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const validation = require("../middleware/validation");
const upload = require("../middleware/imageUpload");
const appContoller = require("../controllers/app1Controller")
const ProductModel = require("../models/productSchema");

router.get("/", async (req, res) => {
  const products = await ProductModel.find();
  res.render("home", {products});
});

router.get("/about", async (req, res) => {
  res.render("about");
});

router.get("/service", async (req, res) => {
  res.render("service");
});

// Usre Registration
router
  .route("/register")
  .get(authentication.logAuth, appContoller.userRegistrationGet)
  .post(appContoller.userRegistrationPost);////****************************************** */

// User LogIn
router
  .route("/login")
  .get(authentication.logAuth, appContoller.userLoginGet)
  .post(appContoller.userLoginPost);

router.get("/dashboard", authentication.adminAuth, appContoller.dashBoard);
router.get("/profile", authentication.clientAuth, appContoller.profile);

router.get("/innerpage", authentication.roleAuth, (req, res) => {
  res.send("<h1>Innerpage</h1> <a href='/dashboard'>DashBoard</a>");
});

// User LogOut
router.get("/logout", authentication.roleAuth, appContoller.userLogOut);

//Post CRUD
router.get("/add_tarkari", authentication.adminAuth, appContoller.addTarkariGet)
router.post("/add_tarkari", upload.single("vegImage"), appContoller.addTarkariPost)
router.get("/delete_tarkari/:pid", authentication.adminAuth, appContoller.deleteTarkariPost)
router.get("/update_tarkari/:pid", authentication.adminAuth, appContoller.updateTarkariGet)
router.put("/update_tarkari/:pid", upload.single("vegImage"), appContoller.updateTarkariPut)

module.exports = router;
