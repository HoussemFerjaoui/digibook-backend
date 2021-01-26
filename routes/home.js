const express = require('express');
const home = express.Router(); 
const Post = require('../models/post');
const User = require('../models/User');
const Comment = require('../models/comment');

// const { post, route } = require('./booksearch'); this was added auto

// TODO: Refactor to use promises
// I suppose all the requests here should have the email, the token put it in the header later
// we cant use postownerEmail as id cuz he can post more than one post > we use Date.now for now as a postID , type:data caused problems? > String it.



// gets all posts
home.get('/getallposts', async(req,res) => {
    try{
        const allPosts = await Post.find();
        res.json(allPosts);
    }catch(err){
        res.status(400).json({ message : err });
    }
});

// add post
home.post('/addpost', async (req,res) =>{
    const post = new Post({
        name: req.body.name,
        email: req.body.email,
        text: req.body.text,
        picurl: req.body.picurl,
        likesList: req.body.likesList,
        commentList: req.body.commentList
        //the rest should be defaulted to null, since its new post
    });
    // async way
    try{
        const addedPost = await post.save();
        res.json(addedPost);
    }catch(err){
        res.status(400).json({ message: err });
    }
});

//likebutton should add/remove the like
//searchs for post with postID(Date.now) > checks if currentUserEmail in likeslist or not > updates > return likes.length
// TODO: return status as well , button liked or not, DONE I THINK ?
home.get('/likepost/:currentUserEmail/:postOwnerEmail/:postID', async(req,res) => {
    try{
        // find post by Owner Email
        const post = await Post.findOne({date: req.params.postID});
        console.log(post.text);
        // check if currentUserEmail in the likesList or not and update
        if(post.likesList.includes(req.params.currentUserEmail)){
            let index = post.likesList.indexOf(req.params.currentUserEmail);
            let newLikes = post.likesList;
            newLikes.splice(index, 1);
            const updatedpost = await Post.updateOne({date: post.date}, {$set: {likesList: newLikes}});
            //var user = await User.findOneAndUpdate(
              //  {email: req.params.postOwnerEmail},
                //{$set: {notifPostID: user.notifEmailAction.set(req.params.postOwnerEmail, "Liked")}}
                //)

            // check for empty array?
            res.send({"count": String(newLikes.length),
            "likestatus": "NoLike",
            "newLikesList": newLikes});
        }else{
            let newLikes = post.likesList;
            newLikes.push(req.params.currentUserEmail);
            const updatedpost = await Post.updateOne({date: post.date}, {$set: {likesList: newLikes}});
            res.send({"count": String(newLikes.length),
            "likestatus": "Like",
            "newLikesList": newLikes});
        }
    }catch(err){
        res.status(400).json({ message : err });
    }
});

// get all post's comment
// as always date = postid
home.get('/allpostcomments/:date', async(req,res)=>{
    try{
        const postcomments = await Comment.find({date: req.params.date});
        res.json(postcomments); 
        //console.log(postcomments);
    }catch(err){
        res.json({message : err});
    }
});
  

// add comment
home.post('/addcomment', async (req,res)=>{
    
    const NewComment = new Comment ({
      
      name: req.body.name,
      email: req.body.email,
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



// todo: count comments


module.exports = home;