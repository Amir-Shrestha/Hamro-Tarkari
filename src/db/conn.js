// 1. import mongoose module in this file and store in mongooseObj constant variable.
const mongooseObj = require("mongoose");

// 2. Connect this node file of this express app with database(mongoDB).
    // - Creates or Activate existing Database:
mongooseObj.connect("mongodb://localhost:27017/userDB") // returns a promise: means provide output in future // deprecation error
.then(() => console.log("Connection established !"))
.catch((error) => console.log("Connection fails !!! :", error))

// 3.Define the structure of document - Mongoose Schema.