require('dotenv').config()
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")

require("./db/conn.js")
const UserModelCollectionClass = require("./models/userSchema")

const app = express();
const port = 3006;
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

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
            const token = await registerUserObj.generateToken();
            console.log(token)

            const newUserRegistered = await registerUserObj.save();
            console.log(newUserRegistered)
            res.status(201).render("home")

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
        console.log(passwordMatch)
        console.log(formPassword)
        console.log(fetchedUserDocument.password)
        if(passwordMatch){
            console.log("Email and Password matched!")
            res.status(201).render("home")
        }else{
            console.log("Email and Password not matched!")
            res.send("not logged")
        }
    } catch (error) {
        res.status(400).send("Invalid LogIn credentials!,",error)
    }
})

// alt index
app.use(express.static(staticPath));

//listen to requested port
app.listen(port, (req, res) => {
    console.log(`Request listening to the port number ${port}!`)
})
