var mongoose = require("mongoose");

var siberpostSchema = new mongoose.Schema({
  name: String,
  image : String,
  description : String
});


module.exports= mongoose.model("Siberpost",siberpostSchema);
