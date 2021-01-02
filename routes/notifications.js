const express = require('express');
const notifications = express.Router(); 
const Notification = require('../models/notification');

// TODO: not display when u action ur own shit


// get all notifications by connected user email
notifications.get('/getallnotifications/:email', async(req,res) => {
    try{
        const allNotifications = await Notification.find({email: req.params.email});
        res.json(allNotifications);
    }catch(err){
        res.status(400).json({ message : err });
    }
});


notifications.post('/addnotification', async (req,res) =>{
    const notification = new Notification({
        name: req.body.name,
        email: req.body.email,
        action: req.body.action,
        currentemail: req.body.currentemail,
        picurl: req.body.picurl,
        notificationid: req.body.notificationid
        //the rest should be defaulted to null, since its new post
    });
    // async way
    try{
        const addednotification = await notification.save();
        res.json(addednotification);
    }catch(err){
        res.status(400).json({ message: err });
    }
});

module.exports = notifications;

