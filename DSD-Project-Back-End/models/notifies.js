var mongoose = require("mongoose");

var NotifiesSchema = new mongoose.Schema({
    studyId: String,
    time: Date,
    body: String,
    title: String,
    form_id: {
        type: String,
        default: '',
    }
}, { strict: false }); 

module.exports = mongoose.model('Notifies', NotifiesSchema);