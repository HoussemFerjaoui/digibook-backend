const express = require('express');
const router = express.Router(); //Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
const User = require('../models/User')


router.get('/', async(req,res) => {
    // gets all User
    try{
        const Allschemas = await User.find();
        res.json(Allschemas);
    }catch(err){
        res.json({ message : err });
    }
});

//gets back a specific "User"(filtering by Email)
router.get('/:email', async(req,res) => {
    try{
        const Specificschema = await User.findOne({email: req.params.email});
        res.json(Specificschema);
    }catch(err){
        res.json({ message : err });
    }
});

module.exports = router;