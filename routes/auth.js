const express = require('express');
const User= require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const {body,validationResult}=require('express-validator')
var jwt =require('jsonwebtoken');
const fetchuser= require('../middleware/fetchuser')

//Route 1:Create a user using POST"/api/auth".Doesn't require Auth

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

//Route 2: AUthenicate a  User using : Post "/api/auth.login".
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
],async (req, res) => {

     //If there are errors, return Bad requeset and the errors
     const errors = validationResult(req);
     if(!errors.isEmpty()) {
         return res.status(400).json({errors: errors.array() });
     }

     const{email,password}=req.body;
     try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken= await jwt.sign(data, JWT_SECRET);
        res.json({authToken})
    

     }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});

//Route 3: Get Loggedin User Details using: Post "/api/auth/getuser". Login required
router.post('/getUser',fetchuser, async (req, res) => 
    {
try{ 
    userId=req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
} catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
}
})

module.exports = router;
