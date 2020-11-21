require('dotenv/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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



// import routes modules
const testroute = require('./routes/testroute');
app.use('/testroute',testroute);
const booksearch = require('./routes/booksearch');
app.use('/booksearch', booksearch);

//middlewares
app.use('/ocrtest', (req,res) => {
    console.log('tessereact example exec');
    res.send("this is ocr tesseract test page")
    Tesseract.recognize(
      'https://tesseract.projectnaptha.com/img/eng_bw.png',
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

//route param test
app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
  })



// listen to server
app.listen(3000);