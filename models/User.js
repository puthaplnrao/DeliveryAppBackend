const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  companyname: String,
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
});
// console.log(userSchema);
module.exports = mongoose.model("User", userSchema);
