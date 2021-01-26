const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//require("dotenv/config")
const { registerValidation, loginValidation } = require('../functions/validation');


router.post('/register', async(req,res) => {
    // input data validation
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Confirm Password check
    if(req.body.ConfirmPassword.localeCompare(req.body.password)) return res.status(400).send("Wrong Confirm Password!"); 
    
    // checking if user already exist in db
    //TODO: make the find into a global function
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("User already exist");

    //Hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //adds user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({userid: user._id});
    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res) => {
    // input data validation
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // check email
    //TODO: make the find into a global function
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("email incorrect dosnt exist");
    // check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('pass incorrect')

    // create and assign a token
    // const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    // res.header('auth-token', token).send(token);
    res.send("Welcome : " + user.name + " " + user.email);

});

module.exports = router;