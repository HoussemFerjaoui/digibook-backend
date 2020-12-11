const express = require('express');
const booksearch = express.Router();
const request = require('request'); // HOW DID THIS LINE GOT REMOVED
const verifyToken = require('../functions/verifyToken');
const Tesseract = require('tesseract.js');


var multer  = require('multer');
const path = require('path');
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



booksearch.get('/', (req,res) => {
    res.end("Welcome to book search route!");
});

// NOT FINISHED 
/*
booksearch.post('/up', (req,res, next) => {
    upload(req, res, (err) => {
        if(err) {
            res.send(err);
        } else {
            //res.send(req.file);
            Tesseract.recognize('uploads/' + req.file.filename, 'eng', { logger: m => console.log(m) })
                .then(({ data: { text } }) => {
                    console.log('success! Text: \n' + text);
                    console.log(req.file);
                    res.send(text)
                    passsing converted text into google books api
                    let ch = "https://www.googleapis.com/books/v1/volumes?q=\""+text.toString()+"\"&printType=books&langRestrict=en&orderBy=relevance&maxResults=1&key=AIzaSyDbM6KY3e8LOvB5mDzI6DA1PMn2EbIFMq4"
                    console.log(ch + '\n');
                    const options = {
                        url: ch,
                        method: 'GET'
                    };
                    request(options, function(err, gres, body) {
                        let json = JSON.parse(body);
                        res.send(json);
                        console.log(json.items[0].volumeInfo.title);
                    }); 

                    next();
                  }) 
                .catch(error => {
                    console.log(error.message)
                    next();
                })
        }
    })
});*/


// TODO: is this async ?
booksearch.get('/search', (req,res) => {
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
        console.log(json.items[0].volumeInfo.title);
    });
});




// router.post(); // possibly to put the newly searched book into the mongodb and point likes/dislikes/comments/review to it.








module.exports = booksearch;
