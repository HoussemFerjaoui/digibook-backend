require('dotenv/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('uploads/profileimages/'))

// tessereact.js
const Tesseract = require('tesseract.js');



// Connecting to Database
const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true
    //useUnifiedTopology: true 
};
mongoose.connect(process.env.DB_CONNECTION,options, ()=> 
    console.log('Connected to DB!'));



// import routes modules:
// testroute
const testroute = require('./routes/testroute');
app.use('/dbtest',testroute);
// home
const home = require('./routes/home');
app.use('/api/user/home', home);
// booksearch
const booksearch = require('./routes/booksearch');
app.use('/booksearch', booksearch);
// load auth.js
const auth = require('./routes/auth');
app.use('/api/user', auth);
// load CurrentSession.js
const CurrentSession = require("./functions/CurrentSession");
app.use("/api/CurrentSession", CurrentSession);
// Load profile.js
const profile = require("./routes/profile");
app.use("/api/user/profile", profile);


//middlewares
app.use('/ocrtest', (req,res) => {
    console.log('tessereact example exec');
    res.send("this is ocr tesseract test page check console")
    Tesseract.recognize(
      'https://img.picturequotes.com/2/991/990443/planting-a-flowers-like-opening-a-book-because-either-way-youre-starting-something-and-your-gardens-quote-1.jpg',
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log(text);
    }) 
    
})

app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
  })

// home page route
app.get('/', (req, res) => {
    console.log("server HomePage")
    res.send('Welcome!');
});

app.get('/hey', (req,res) => {
  res.send("hey");
});

//route param test
app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
  })



// listen to server
app.listen(3000);