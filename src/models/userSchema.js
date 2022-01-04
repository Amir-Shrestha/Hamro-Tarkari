const mongooseObj = require("mongoose");
const bcrypt = require("bcryptjs")

// 3.Define the structure of document.
    // - Mongoose Schema:
    const userSchemaObj = new mongooseObj.Schema({
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

    userSchemaObj.pre("save", async function(next){
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password, 10);
            next();
        }
    })

// 4. Create collection using above schema.
    // - define model of collection(class)
const UserClass = new mongooseObj.model("userCollection", userSchemaObj);
module.exports = UserClass;