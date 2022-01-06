require('dotenv').config()
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

require("./db/conn.js")
const UserModelCollectionClass = require("./models/userSchema")
const auth = require("./middleware/auth")

const app = express();
const port = process.env.PORT || 3006;
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(cookieParser())
// get form data
app.use(express.urlencoded({extended: false}));

// set view engine
app.set('views', viewsPath);
app.set("view engine", "hbs")
hbs.registerPartials(partialsPath);

// mention hbs template engine route
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/service", (req, res) => {
    res.render("service")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

//create new user in database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.cpassword;
        if( password === confirmPassword ){
            const registerUserObj = new UserModelCollectionClass({
                username: req.body.username,
                mobile: req.body.mobile,
                email: req.body.email,
                address: req.body.address,
                password: req.body.password,
                role: "customer"
            })

            // pre midddleware to hashpassword in userSchema.js

            // midddleware to generate token.
            const tokenCreated = await registerUserObj.generateToken();
            // store token in cookies.
            res.cookie("myJwt", tokenCreated, {
                expires: new Date(Date.now() + 60000),
                httpOnly: true
            });

            const newUserRegistered = await registerUserObj.save();
            console.log(newUserRegistered)
            res.status(201).redirect("dashboard")

        }else{
            res.send("Password and Confirm Password doesn't match !")
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).send(error)
    }
})

// login validation
app.post("/login", async (req, res) => {
    try {
        const formEmail = req.body.email;
        const formPassword = req.body.password;
        const fetchedUserDocument = await UserModelCollectionClass.findOne({email: formEmail});
        const passwordMatch = await bcrypt.compare(formPassword, fetchedUserDocument.password)

        // midddleware to generate token.
        const tokenCreated = await fetchedUserDocument.generateToken();
        // store token in cookies.
        res.cookie("myJwt", tokenCreated, {
            // expires: new Date(Date.now() + 60000),
            httpOnly: true,
            // secure: true
        });

        if(passwordMatch){
            console.log("Email and Password matched!")
            res.status(201).redirect("dashboard")
        }else{
            console.log("Email and Password not matched!")
            res.send("not logged")
        }
    } catch (error) {
        res.status(400).send("Invalid LogIn credentials!,",error)
    }
})

app.get("/dashboard", auth, (req, res) => {
    console.log(`This the jwt retirved/parse from cookie: ${req.cookies.myJwt}`)
    res.render("dashboard",{user:req.user})
})

app.get("/logout", auth, async(req, res) => {
    try {
        res.clearCookie("myJwt");
        req.user.tokens = req.user.tokens.filter((tokenObj)=> tokenObj.token != req.cookieToken)
        // console.log('ttttttttttt',req.user.tokens)
        // console.log('uuuuuuuuuuu',req.user)
        const x = await req.user.save();
        console.log(x);
        console.log("Log Out !")
        res.redirect("login");
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get("/innerpage", auth, (req, res) => {
    res.send("<h1>Innerpage</h1> <a href='/dashboard'>DashBoard</a>")
})

// alt index
app.use(express.static(staticPath));

//listen to requested port
app.listen(port, (req, res) => {
    console.log(`Request listening to the port number ${port}!`)
})
