const mongoose = require('mongoose');

const comments = new mongoose.Schema({
    type: Map,
    of: String
})


// post has : likes , dislikes, comments
const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    picurl: {
        type: String,
        default: "/uploads/default_profile_picture" // should be defaulted to one single image either fel base or fel android or both
    },
    date: {
        type: Date,
        default: Date.now
    },
    commentsList: [comments],
    likesList: [String]

});

module.exports = mongoose.model('Post', postSchema);