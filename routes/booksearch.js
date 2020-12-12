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
booksearch.post('/search', (req,res,next) => {
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
                    fetch(turl, { method: 'GET'})
                        .then(res => res.json())
                        .then(json => res.send(json));
                        next();
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
/*booksearch.get('/search', (req,res) => {
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
});*/




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




module.exports = booksearch;
