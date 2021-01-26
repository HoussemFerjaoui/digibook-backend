const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },
    
    action: {
        type: String,
        required: true
    },

    currentemail: {
        type: String,
        required: true
    },

    picurl: {
        type: String,
        default: "/uploads/default_profile_picture" // should be defaulted to one single image either fel base or fel android or both
    },

    notificationid: {
        type: String,
        default: Date.now
    },

});

// currentemail : the user who did the action
// email : the post's owner email, so when u getallnotifications , u use this. > find all the notification with ur email as owner

module.exports = mongoose.model('Notification', notificationSchema);