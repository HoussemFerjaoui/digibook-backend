var mongoose = require('mongoose');


var BookCommentSchema = new mongoose.Schema({
    
    bookid: {
        type: String,
    },
    email: {
        type: String,
      },
    name: {
      type: String,
    },
    picurl: {
        type: String,
      },
    text: {
      type: String,
      required : true
    },
    date:{
      type: Date,
      default: Date.now
    }
    
});

module.exports = mongoose.model("BookComment", BookCommentSchema);
