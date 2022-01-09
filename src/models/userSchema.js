const mongooseObj = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 3.Define the structure of document.
// - Mongoose Schema:
const userSchemaObj = new mongooseObj.Schema({
  username: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  datejoin: {
    type: Date,
    default: Date.now,
  },
  role: String,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});


// (generateToken as middleware) to generate tokens
userSchemaObj.methods.generateToken = async function () {
  try {
    const tokenCreated = await jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: tokenCreated });
    await this.save();
    return tokenCreated;
  } catch (error) {
    res.send("Error:", error);
    console.log("Error:", error);
  }
};


// (pre as middleware) to hash password
userSchemaObj.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


// 4. Create collection using above schema.
// - define model of collection(class)
const UserClass = new mongooseObj.model("userCollection", userSchemaObj);
module.exports = UserClass;
