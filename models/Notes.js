const mongoose=require('mongoose');

const NotesSchema = new Schema({
    title:{
        type:string,
        required:true
    },
    description:{
        type:string
    },
    tag:{
        type:string,
        default:"General"
    },
    date: {
        type: Date,
        default: Date.now // corrected typo here
    }
  });

    module.exports=mongoose.model('notes', NotesSchema)