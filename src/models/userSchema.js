const mongooseObj = require("mongoose");

// 3.Define the structure of document.
    // - Mongoose Schema:
    const userSchema = new mongooseObj.Schema({
        username: {
            type: String,
            required: true
        },
        mobile:  {
            type: Number,
            required: true
        },
        email:  {
            type: String,
            required: true
        },
        address:  {
            type: String,
            required: true
        },
        password:  {
            type: String,
            required: true
        },
        datejoin: {
            type: Date,
            default: Date.now
        },
        role: String
    })

// 4. Create collection using above schema.
    // - define model of collection(class)
const UserClass = new mongooseObj.model("userCollection", userSchema);
module.exports = UserClass;