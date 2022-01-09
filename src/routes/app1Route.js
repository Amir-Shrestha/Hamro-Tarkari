const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const validation = require("../middleware/validation");
const authContoller = require("../controllers/app1Controller")

router.get("/", (req, res) => {
  res.render("home");
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
  .get(authentication.logAuth, authContoller.userRegistrationGet)
  .post(authentication.logAuth, validation, authContoller.userRegistrationPost);

// User LogIn
router
  .route("/login")
  .get(authentication.logAuth, authContoller.userLoginGet)
  .post(authentication.logAuth, authContoller.userLoginPost);

router.get("/dashboard", authentication.auth, (req, res) => {
  res.render("dashboard", { username: req.user.username });
});

router.get("/innerpage", authentication.auth, (req, res) => {
  res.send("<h1>Innerpage</h1> <a href='/dashboard'>DashBoard</a>");
});

// User LogOut
router.get("/logout", authentication.auth, authContoller.userLogOut);

module.exports = router;
