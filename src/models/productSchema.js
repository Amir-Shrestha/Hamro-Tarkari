const mongooseObj = require("mongoose");

// 3.Define the structure of document.
// - Mongoose Product Schema:
const productSchemaObj = new mongooseObj.Schema({
  product_name: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
  },
  image: {
    type: String
  }
});

// 4. Create collection using above schema.
// - define model of collection(class)
const ProductClass = new mongooseObj.model("productCollection", productSchemaObj);
module.exports = ProductClass;


// // (generateToken as middleware) to generate tokens
// userSchemaObj.methods.saveImage = async function () {
//   this.image = this.tokens.concat({ token: tokenCreated });
//   await this.save();
// };