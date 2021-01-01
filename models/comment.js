var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
    
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
      required: true
    }
    
});

module.exports = mongoose.model("Comment", CommentSchema);
