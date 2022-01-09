// import built-in node modules, and store exported objects by module into constant variable:
require('dotenv').config()
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require("cookie-parser");

// import custome node modules, and store exported objects by module into constant variable:
require("./db/conn.js")
const app1Router = require("./routes/app1Route");

// create constant variable: app_variable, port_variable, path_variable
const mainServer = express();
const port = process.env.PORT || 3006;
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setting project's main server configuration:
mainServer.set('views', viewsPath); // set view path
mainServer.set("view engine", "hbs") // set view engine
hbs.registerPartials(partialsPath); // set partials view path

// middlewares
mainServer.use(cookieParser()) // middleware to parse cookies
mainServer.use(express.urlencoded({extended: false}));// get form data
mainServer.use('/', app1Router);// calling route of app1
mainServer.use(express.static(staticPath));//  built-in express middleware to show static views.

//listen to imcomming requested port
mainServer.listen(port, (req, res) => {
    console.log(`Request listening to the port number ${port}!`)
})

