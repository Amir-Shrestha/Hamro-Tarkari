// import built-in node modules, and store exported objects by module into constant variable:
require('dotenv').config()
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require("cookie-parser");

// import custome node modules, and store exported objects by module into constant variable:
require("./db/conn.js")
const miniAppRouter = require("./routes/miniAppRoute");

// create constant variable: app_variable, port_variable, path_variable
const app = express();
const port = process.env.PORT || 3006;
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//set app environment variables:
app.set('views', viewsPath); // set view path
app.set("view engine", "hbs") // set view engine
hbs.registerPartials(partialsPath); // set partials view path

// middleware
app.use(cookieParser()) // middleware to parse cookies
app.use(express.urlencoded({extended: false}));// get form data

// define index request router:
app.get("/", (req, res) => {
    res.render("home")
})

// calling miniapp route
app.use('', miniAppRouter);

//  built-in express middleware to show static views.
app.use(express.static(staticPath));

//listen to imcomming requested port
app.listen(port, (req, res) => {
    console.log(`Request listening to the port number ${port}!`)
})

