var mongoose = require("mongoose");

var FeedbackSchema = new mongoose.Schema({
  feedback_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  feedback: String,
  user_id: String,
  manual : Boolean,
  date: { type: Date, default: Date.now },
  
},{strict: false});

module.exports = mongoose.model('Feedback', FeedbackSchema,'feedbacks'); 