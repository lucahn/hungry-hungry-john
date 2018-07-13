var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ScrapSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Scrap = mongoose.model("Scrap", ScrapSchema);

module.exports = Scrap;
