const express = require('express');
const booksearch = express.Router();
const request = require('request'); // HOW DID THIS LINE GOT REMOVED
const verifyToken = require('../functions/verifyToken');
const Tesseract = require('tesseract.js');
var multer  = require('multer');
const path = require('path');
const { json } = require('body-parser');
const fetch = require('node-fetch'); //NO NEED , using request module for eror handling
var fs = require('fs');
const { nextTick } = require('process');
const TextCleaner = require('text-cleaner');

const Book = require('../models/book');
const BookComment = require('../models/bookcomment');
const book = require('../models/book');



//const { path } = require('dotenv/lib/env-options');

// Set Multer Storage Engine
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Init multer upload
const upload = multer({
    storage: storage
}).single('textimage');




// ROUTES:

//WelcomeRoute
booksearch.get('/', (req,res) => {
    res.end("Welcome to book search route!");
});



// bookSearch Route, TODO: Delete uploaded picture after success search!
// TODO: add a TEXT CLEANER for the converted text!
booksearch.post('/search', (req,res,next) => {
    //receiving the uploaded pic from frontend and converting the image to text!  
    upload(req, res, (err) => {
        if(err) {
            res.send(err);
        } else {
            // converting uploaded image to text
            
            Tesseract.recognize('uploads/' + req.file.filename, 'eng', { logger: m => console.log(m) })
                .then(({ data: { text } }) => {
                    // doing the request to external API with the converted text
                    // the problem I had with this : using synch functionaities with an async functionalities, basicaly the synch will get executed while the async still processing AND calling next(), put next in its own then promise after the thing is done.
                    //let cleantext = TextCleaner(String(text)).removeApostrophes().removeDashes().removeHtmlEntities().removeChars({exclude: "0-9"}).trim().condense().toString();
                    let cleantext = TextCleaner(String(text)).removeDashes().removeHtmlEntities().trim().condense().toString();
                    let turl = "https://www.googleapis.com/books/v1/volumes?q=\""+cleantext+"\"&printType=books&langRestrict=en&orderBy=relevance&maxResults=10&key=AIzaSyDbM6KY3e8LOvB5mDzI6DA1PMn2EbIFMq4"
                    fetch(encodeURI(turl), { method: 'GET'})
                        .then(res => res.json())
                        .then(json => res.send(json)).then(console.log(encodeURI(turl))).then(console.log(turl)).then(console.log(text));
                  })
                .catch(error => {
                    console.log(error.message)
                })
        }
    })    
});
    /*fs.readFile('temp.txt', 'utf8', function (err,data) {
        while(err);
        console.log("THIIIIIIIIIIIIIIIIIIIS" + data);
        //doing the search in google books api, doing it with modulereq for the error handling but also work with fetch-module, the problem I had here was doing this in the upload scope.
    let ch = "https://www.googleapis.com/books/v1/volumes?q='"+data+"'&printType=books&langRestrict=en&orderBy=relevance&maxResults=1&key=AIzaSyDbM6KY3e8LOvB5mDzI6DA1PMn2EbIFMq4"
    console.log(ch);
    const options = {
        url: ch,
        method: 'GET'
    };
    request(options, function(err, gres, body) {
        if (err) {
            return console.error('GET request to google books API FAILED!', err)};
        let json = JSON.parse(body);
        res.send(json);
        console.log(json.items[0].volumeInfo.title);
        });*/

     

// OLD TESTING ROUTE
booksearch.post('/test', (req,res) => {
// lets suppose we have a booksearch(text) function
    // maybe adding var inside of the url string can be better?
    let text = "Italians have a little joke, that the world is so hard a man must have two fathers to look after him, and that's why they have godfathers"
    let ch = "https://www.googleapis.com/books/v1/volumes?q='"+text+"'&printType=books&langRestrict=en&orderBy=relevance&maxResults=3&key=AIzaSyDbM6KY3e8LOvB5mDzI6DA1PMn2EbIFMq4"
    console.log(ch);
    const options = {
        url: ch,
        method: 'GET'
    };
    request(options, function(err, gres, body) {
        let json = JSON.parse(body);
        res.send(json);
        console.log(json.items[0].volumeInfo.title);
    });
});




// router.post(); // possibly to put the newly searched book into the mongodb and point likes/dislikes/comments/review to it.



/*booksearch.post('/search', (req,res, next) => {
    //receiving the uploaded pic from frontend and converting the image to text!  
    upload(req, res, (err) => {
        if(err) {
            res.send(err);
        } else {
            // converting uploaded image to text
            Tesseract.recognize('uploads/' + req.file.filename, 'eng')
                .then(({ data: { text } }) => {
                    // doing the request to external API with the converted text
                    let turl = "https://www.googleapis.com/books/v1/volumes?q='"+text+"'&printType=books&langRestrict=en&orderBy=relevance&maxResults=1&key=AIzaSyDbM6KY3e8LOvB5mDzI6DA1PMn2EbIFMq4"
                    console.log(turl);
                    fetch(turl, { method: 'GET'})
                        .then(res => res.json())
                        .then(json => res.send(json));
                  }) 
                .catch(error => {
                    console.log(error.message)
                    
                })
                
        }
    })    
});*/

// adds bookid if dosnt already exist
booksearch.post('/extendedresults', async (req,res) => {
    // search if bookid exist else add it, if exists getlikes & comments

    // search if bookid exists
    const bookExist = await Book.findOne({bookid: req.body.bookid});
    if(bookExist){ 
        //return res.status(400).send("Bookid already exist");

        res.json(bookExist);

    }else{
        const book = new Book({
            bookid: req.body.bookid,
            bookname: req.body.bookname,
            bookauthor: req.body.bookauthor,
            bookcover: req.body.bookcover,
            upvotelist: req.body.upvotelist,
            //the rest should be defaulted to null, since its new post
        });
        // async way
        try{
            const addedbook = await book.save();
            res.json(addedbook);
        }catch(err){
            res.status(400).json({ message: err });
        }
    }
})

booksearch.post('/extendedupvote/:bookid/:currentUserEmail', async (req,res) => {
    try{
        // find post by Owner Email
        const book = await Book.findOne({bookid: req.params.bookid});
        //console.log(post.text);
        // check if currentUserEmail in the likesList or not and update
        if(book.upvotelist.includes(req.params.currentUserEmail)){
            let index = book.upvotelist.indexOf(req.params.currentUserEmail);
            let newUpvotes = book.upvotelist;
            newUpvotes.splice(index, 1);
            const updatedpost = await Book.updateOne({bookid: book.bookid}, {$set: {upvotelist: newUpvotes}});
            //var user = await User.findOneAndUpdate(
              //  {email: req.params.postOwnerEmail},
                //{$set: {notifPostID: user.notifEmailAction.set(req.params.postOwnerEmail, "Liked")}}
                //)

            // check for empty array?
            res.send({"count": String(newUpvotes.length),
            "likestatus": "NoLike",
            "newLikesList": newUpvotes});
        }else{
            let newUpvotes = book.upvotelist;
            newUpvotes.push(req.params.currentUserEmail);
            const updatedpost = await Book.updateOne({bookid: book.bookid}, {$set: {upvotelist: newUpvotes}});
            res.send({"count": String(newUpvotes.length),
            "likestatus": "Like",
            "newLikesList": newUpvotes});
        }
    }catch(err){
        res.status(400).json({ message : err });
    }
})

booksearch.get('/extendedallcomments/:bookid', async(req,res)=>{
    try{
        const bookcomments = await BookComment.find({bookid: req.params.bookid});
        res.json(bookcomments); 
        //console.log(postcomments);
    }catch(err){
        res.json({message : err});
    }
});

booksearch.post('/extendedaddcomment', async (req,res)=>{
    
    const NewComment = new BookComment ({
      
      bookid: req.body.bookid,
      email: req.body.email,
      name: req.body.name,
      picurl: req.body.picurl,
      text: req.body.text,
      date: req.body.date

  });
  try{
    const addedComment = await NewComment.save();
    res.json(addedComment);
}catch(err){
    res.status(400).json({ message: err });
}
});

booksearch.post('/extendedaddfav/:bookid/:currentUserEmail', async (req,res) => {
    try{
        // find post by Owner Email
        const book = await Book.findOne({bookid: req.params.bookid});
        //console.log(post.text);
        // check if currentUserEmail in the likesList or not and update
        if(book.favlist.includes(req.params.currentUserEmail)){
            let index = book.favlist.indexOf(req.params.currentUserEmail);
            let newFavList = book.favlist;
            newFavList.splice(index, 1);
            const updatedpost = await Book.updateOne({bookid: book.bookid}, {$set: {favlist: newFavList}});
            //var user = await User.findOneAndUpdate(
              //  {email: req.params.postOwnerEmail},
                //{$set: {notifPostID: user.notifEmailAction.set(req.params.postOwnerEmail, "Liked")}}
                //)

            // check for empty array?
            res.send({"count": String(newFavList.length),
            "likestatus": "NoLike",
            "newLikesList": newFavList});
        }else{
            let newFavList = book.favlist;
            newFavList.push(req.params.currentUserEmail);
            const updatedpost = await Book.updateOne({bookid: book.bookid}, {$set: {favlist: newFavList}});
            res.send({"count": String(newFavList.length),
            "likestatus": "Like",
            "newLikesList": newFavList});
        }
    }catch(err){
        res.status(400).json({ message : err });
    }
})


module.exports = booksearch;
