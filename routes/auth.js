const express = require('express');
const User= require('../models/User');
const router = express.Router();
const {body,validationResult}=require('express-validator')
//Create a user using POST"/api/auth".Doesn't require Auth

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
    let user = User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exits"})
    }
    user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    })
    res.json(user)
} catch(error){
    console.error(error.message);
    res.status(500).send("some Error occured");
}
});

module.exports = router;
