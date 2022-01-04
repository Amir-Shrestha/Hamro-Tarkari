const express = require('express');
const path = require('path');
const hbs = require('hbs');

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

// alt index
app.use(express.static(staticPath));

//listen to requested port
app.listen(port, (req, res) => {
    console.log(`Request listening to the port number ${port}!`)
})
