var mongoose = require('mongoose');


var bookFavoriteSchema = new mongoose.Schema({

    email: {
        type: String,
    },
    
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
    upvotelist: [String]
    
});

module.exports = mongoose.model("BookFavorite", bookFavoriteSchema);
