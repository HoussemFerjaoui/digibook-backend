const express = require('express');
const profile = express.Router();
var multer  = require('multer'); 
const Post = require('../models/post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Book = require('../models/book');






// Set Multer Storage Engine
const storageProfileImages = multer.diskStorage({
    destination: 'uploads/profileimages/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Init multer upload
const uploadProfileImage = multer({
    storage: storageProfileImages
}).single('profilepicture');

// add it to the mongoDB
profile.post('/uploadpic/:CurrentUserEmail', async(req,res) => {
    //receiving the uploaded pic from frontend and converting the image to text!  
    uploadProfileImage(req, res, async(err) => {
        if(err) {
            res.send(err);
        } else {
            let dest = req.file.filename;
            try{
                const uSpecificschema = await User.updateOne(
                    { email : req.params.CurrentUserEmail },
                    { $set: { picurl : dest }
                    });
                const post = await Post.update(
                    { email: req.params.CurrentUserEmail },
                    { $set: { picurl : dest } },
                    { multi: true}
                )
                res.send(req.file.filename); // or res.send("updated!")
            }catch(err){
                res.json({ message : err });
            }
            console.log(req.file);
        }
    })    
});


//TODO: Control saisie here too. like register.
profile.post('/update/:email/:password', async(req,res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    var user = new User();
    const validPass = req.body.password.localeCompare(req.params.password) // can remove the decrype, just compare hashed password directly
    user = req.body;
    console.log(user, req.params.password);
    // check if the pass has changed
    if(validPass){
        user.password = hashedPassword;
        console.log(hashedPassword);
    }
    console.log(req.params.email, req.body.email ,req.params.password, req.body.password,validPass)
    try{
        const uSpecificschema = await User.replaceOne(
            { email : req.params.email },
            user);
        res.json(user); // or res.send("updated!")
    }catch(err){
        res.json({ message : err });
    }
});

// get favorite books
profile.get('/allfavbooks/:email', async(req,res)=>{
    try{
        const favbooks = await Book.find({favlist: { "$in": req.params.email}});
        res.json(favbooks); 
        //console.log(postcomments);
    }catch(err){
        res.json({message : err});
    }
});

module.exports = profile;
