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
    date:{
        type:data,
        dafault:date.now
    }
  });

    module.exports=mongoose.model('notes', NotesSchema)