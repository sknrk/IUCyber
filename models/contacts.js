var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  phoneNumber: String,
  text:String
});


module.exports= mongoose.model("Contact",contactSchema);
