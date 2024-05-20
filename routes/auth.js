const express = require('express');
const User= require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const {body,validationResult}=require('express-validator')
var jwt =require('jsonwebtoken');
//Create a user using POST"/api/auth".Doesn't require Auth

const JWT_SECRET= 'BikramShrestha'

router.post('/createuser', [
    body('name','Enter a valid name').isLength({ min:3 }),
    body('email','Enter a valid email').isEmail(),
    body('password', 'Password must me at least 5 letter').isLength({ min:5 }),
],async (req, res) => {

    //If there are errors, return Bad requeset and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }


    //check whether the user with email exists already
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exits"})
    }
    const salt= await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    //create a new user 
    user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass,
    });

    const data = {
        user:{
            id: user.id
        }
    }
    const authToken= jwt.sign(data, JWT_SECRET);
    res.json({authToken})

    //catch errors
} catch(error){
    console.error(error.message);
    res.status(500).send("some Error occured");
}
});

module.exports = router;
