var mongoose = require("mongoose");

var AnswerSchema = new mongoose.Schema({
  answer_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  user_id: String,
  form_id: String,
  date: { type: Date, default: Date.now },
  answers: {}

},{strict: false});

module.exports = mongoose.model('Answer', AnswerSchema,'answers');