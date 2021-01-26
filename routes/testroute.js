const express = require('express');
const router = express.Router(); //Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
const User = require('../models/User');
//const testschema = require('../models/dbtest'); // load our model

//gets back all "testscehams" (how to bind these data with just this route)
router.get('/', async(req,res) => {
    // res.send('you are on testroute'); you cant have multiple res, once responded its done, just use res.end() anyways for this kinda of response, ur not answering with data
    try{
        const Allschemas = await User.find();
        res.json(Allschemas);
    }catch(err){
        res.json({ message : err });
    }
});

//gets back a specific "testscehams"(filtering by id)
router.get('/:thePassedId', async(req,res) => {
    try{
        const Specificschema = await User.findById(req.params.thePassedId);
        res.json(Specificschema);
    }catch(err){
        res.json({ message : err });
    }
});

// submits a "testschema"
router.post('/', async (req,res) =>{
    const aSchema = new User({
        title: req.body.title,
        date: req.body.date
    });
    // async way
    try{
        const savedSchema = await aSchema.save();
        res.json(savedSchema);
    }catch(err){
        res.json({ message: err });
    }
    /*aSchema.save().then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({ message: err });
    })
    console.log(req.body); */
});

//update a "testschema"
router.patch('/:thePassedId', async(req,res) => {
    try{
        const uSpecificschema = await User.updateOne(
            { _id : req.params.thePassedId },
            { $set: { title : req.body.title }
            });
        res.json(uSpecificschema); // or res.send("updated!")
    }catch(err){
        res.json({ message : err });
    }
});

// deletes a "testschema" by id
router.delete('/:thePassedId', async(req,res) => {
    try{
        const rSpecificschema = await User.remove({ _id : req.params.thePassedId });
        res.json(rSpecificschema); // or res.send("removed successfuly")
    }catch(err){
        res.json({ message : err });
    }
});

module.exports = router;