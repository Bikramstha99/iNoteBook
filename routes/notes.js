const express = require('express');
const router = express.Router();
const fetchuser= require('../middleware/fetchuser');
const Note = require ('../models/Note');
const {body,validationResult}=require('express-validator')

// Route 1: Get ALl the Notes using : Get "api/notes/fetchallnotes" Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try{
    const notes = await Note.find({user: req.user.id})
    res.json(notes); 
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("some Error occured");
    }

});

// Route 1: Add a new Note using : Post "api/notes/addnote" Login Required
router.post('/addnote', fetchuser, [
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

// Route 3: Updating a existing Note using : Post "api/notes/updatenote" Login Required
router.put('/updatenote/:id', fetchuser, [
    body('title','Enter a valid title').isLength({ min:3 }),
    body('description', 'Description must me at least 5 letter').isLength({ min:5 }),
], async (req, res) => {
    try{
    const {title ,description,tag}= req.body

    //Create a newNote Object
    const newNote ={};
    if(title){newNote.title =title};
    if(description){newNote.description =description};
    if(tag){newNote.tag =tag};

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.Status(404).send("Not FOund")}

    if(note.user.toString() != req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note=await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
}catch(error){
    console.error(error.message);
     res.status(500).send("some Error occured");
}
});


module.exports = router;
