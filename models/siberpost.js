var mongoose = require("mongoose");

var siberpostSchema = new mongoose.Schema({
  name: String,
  date : String,
  image: String,
  tur: String,
  description : String,
  postDetail: String,
  images : Array
});


module.exports= mongoose.model("Siberpost",siberpostSchema);
