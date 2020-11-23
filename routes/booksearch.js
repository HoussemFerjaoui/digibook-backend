const express = require('express');
const booksearch = express.Router();
const request = require('request');




booksearch.get('/',(req,res) => {
    res.end("Welcome to book search route!");
});


// TODO: is this async ?
booksearch.get('/search', (req,res,next) => {
// lets suppose we have a booksearch(text) function
    // maybe adding var inside of the url string can be better?
    let ch = "https://www.googleapis.com/books/v1/volumes?q='"+req.body.text+"'&printType=books&langRestrict=en&orderBy=relevance&maxResults=1&key=AIzaSyDbM6KY3e8LOvB5mDzI6DA1PMn2EbIFMq4"
    console.log(ch);
    const options = {
        url: ch,
        method: 'GET'
    };
    request(options, function(err, gres, body) {
        let json = JSON.parse(body);
        res.send(json);
    });
});




// router.post(); // possibly to put the newly searched book into the mongodb and point likes/dislikes/comments/review to it.








module.exports = booksearch;
