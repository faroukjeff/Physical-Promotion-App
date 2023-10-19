var mongoose = require("mongoose");

var FormSchema = new mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  frequency: String,
  name: { type: String, unique: true },
  questions: {}

},{strict: false});

module.exports = mongoose.model('Form', FormSchema,'forms'); 