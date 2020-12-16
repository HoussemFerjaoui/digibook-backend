const express = require('express');
const profile = express.Router();
var multer  = require('multer'); 
const Post = require('../models/post');
const User = require('../models/User');




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
            let dest = req.file.destination + req.file.filename;
            try{
                const uSpecificschema = await User.updateOne(
                    { email : req.params.CurrentUserEmail },
                    { $set: { picurl : dest }
                    });
                res.json(uSpecificschema); // or res.send("updated!")
            }catch(err){
                res.json({ message : err });
            }
            console.log(req.file);
        }
    })    
});

module.exports = profile;
