const mongoose = require('mongoose');

const ArtcileSchema = mongoose.Schema({
    title : {type: String,required : true},
    content : {type: String,required : true},
    imagePath: { type: String, required: true },
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Articles',ArtcileSchema);