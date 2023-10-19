var mongoose = require("mongoose");

var UsersSchema = new mongoose.Schema({
    studyId: Number,
    password: String,
    formsIds: [String],
    role: {
        type: String,
        default: ''
    },
    firstLogin: {
        type: Boolean,
        default: true
    },
}, { strict: false });

UsersSchema.index({
    studyId: 1
},
    {
        unique: true
    });

module.exports = mongoose.model('User', UsersSchema);