const express = require('express');
const router = express.Router();
const fetchuser= require('../middleware/fetchuser');
const Note = require ('../models/Note');
const {body,validationResult}=require('express-validator')

// Route 1: Get ALl the Notes using : Get "api/notes/fetchallnotes" Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try{
    const notes = await Notes.find({user: req.user.id})
    res.json(notes); 
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("some Error occured");
    }

});

// Route 1: Add a new Note using : Post "api/notes/addnote" Login Required
router.get('/addnote', fetchuser, [
    body('title','Enter a valid title').isLength({ min:3 }),
    body('description', 'Description must me at least 5 letter').isLength({ min:5 }),
],
    async (req, res) => {
        try{
        const {title ,description,tag}= req.body
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }
        const note =new Note({
            title, description, tag,user:req.user.id

        })
        const savedNOte= await note.save();
    res.json(savedNOte); 
        }
        catch(error){
            console.error(error.message);
            res.status(500).send("some Error occured");
        }
});



module.exports = router;
