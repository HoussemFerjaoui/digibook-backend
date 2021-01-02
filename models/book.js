var mongoose = require('mongoose');

// TODO: bookauthor is a list from google books api
var bookSchema = new mongoose.Schema({
    
    bookid: {
        type: String,
        default: "N/A"
      },
    bookname: {
      type: String,
      default: "N/A"

    },
    bookauthor: {
        type: String,
        default: "N/A"
    },
    bookcover: {
        type: String,
        default: "no_image_search_found.jpg"
      },
    upvotelist: [String],
    favlist: [String]
    
});

module.exports = mongoose.model("Book", bookSchema);
