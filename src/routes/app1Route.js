const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const logAuth = require("../middleware/logAuth");

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
  .get(logAuth, authContoller.userRegistrationGet)
  .post(logAuth, authContoller.userRegistrationPost);

// User LogIn
router
  .route("/login")
  .get(logAuth, authContoller.userLoginGet)
  .post(logAuth, authContoller.userLoginPost);

router.get("/dashboard", auth, (req, res) => {
  res.render("dashboard", { username: req.user.username });
});

router.get("/innerpage", auth, (req, res) => {
  res.send("<h1>Innerpage</h1> <a href='/dashboard'>DashBoard</a>");
});

// User LogOut
router.get("/logout", auth, authContoller.userLogOut);

module.exports = router;
