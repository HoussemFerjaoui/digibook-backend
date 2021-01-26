const express = require('express');
const profile = express.Router();
var multer  = require('multer'); 
const Post = require('../models/post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Book = require('../models/book');
const BooksComment = require('../models/bookcomment');
const Notification = require('../models/notification');
const Comment = require('../models/comment');

const { registerValidation, loginValidation } = require('../functions/validation');








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
                //update user profile pic in Users
                const uSpecificschema = await User.updateOne(
                    { email : req.params.CurrentUserEmail },
                    { $set: { picurl : dest }
                    });
                    // update user profile pic in Posts
                const posts = await Post.update(
                    { email: req.params.CurrentUserEmail },
                    { $set: { picurl : dest } },
                    { multi: true}
                )
                // update user profile pic in BooksComment
                const book_comments = await BooksComment.update(
                    { email: req.params.CurrentUserEmail },
                    { $set: { picurl : dest } },
                    { multi: true}
                )
                // update user profile pic in PostsComments
                const posts_comments = await Comment.update(
                    { email: req.params.CurrentUserEmail },
                    { $set: { picurl : dest } },
                    { multi: true}
                )
                // update user profile pic in Notifications
                const notifs = await Notification.update(
                    { currentemail: req.params.CurrentUserEmail },
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

        // input data validation
        const {error} = registerValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        //Confirm Password check
        if(req.body.ConfirmPassword.localeCompare(req.body.password)) return res.status(400).send("Wrong Confirm Password!"); 
        
        // checking if user already exist in db
        //TODO: make the find into a global function
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send("User already exist");

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
        // update all other user info models.
        
        // update userinfo in posts
        const posts = await Post.update(
            { email: req.params.email },
            { $set: { email : req.body.email, name : req.body.name } },
            { multi: true}
        )


        //update posts likesList
        try {
            const postsLikes = await Post.update(
                { likesList: { "$in": req.params.email} },
                { $set: { "likesList.$" : req.body.email } },
                { multi: true}
            )
            console.log("we made it bruh");
        } catch (error) {
            console.log(err);
        }


        // update userinfo in book comments
        const book_comments = await BooksComment.update(
            { email: req.params.email },
            { $set: { email : req.body.email, name : req.body.name } },
            { multi: true}
        )

        // update userinfo in posts comments
        const posts_comments = await Comment.update(
            { email: req.params.email },
            { $set: { email : req.body.email, name : req.body.name } },
            { multi: true}
        )

        // update userinfo in Notifications part 1 : to who the notif is been done owners
        const Notif1 = await Notification.update(
            { currentemail: req.params.email },
            { $set: { currentemail : req.body.email } },
            { multi: true}
        )
        // update userinfo in Notification part 2 : the ones who did the notif
        const Notif2 = await Notification.update(
            { email: req.params.email },
            { $set: { email : req.body.email, name : req.body.name } },
            { multi: true}
        )

        // update books likesList
        const booksLikes = await Book.update(
            { upvotelist: { "$in": req.params.email} },
            { $set: { "upvotelist.$" : req.body.email } },
            { multi: true}
        )

        //update books favList
        const booksFavs = await Book.update(
            { favlist: { "$in": req.params.email} },
            { $set: { "favlist.$" : req.body.email } },
            { multi: true}
        )


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

// get all myposts
profile.get('/allmyposts/:email', async(req,res)=>{
    try{
        const myposts = await Post.find({email: req.params.email});
        res.json(myposts);
        //console.log(postcomments);
    }catch(err){
        res.json({message : err});
    }
});

module.exports = profile;
