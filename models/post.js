const mongoose =require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
    },
    likes:[{type:ObjectId,ref:"user"}],
    comments:[{
        postedBy:{type:ObjectId,ref:"user"},
        text:String,
    }],
    date:{
        type:Date,
        default:Date.now 
    },
    photo:{
        type:String,
        require:true
    },
    postBy:{
        type:ObjectId,
        ref:"user"
    }
})

mongoose.model('post',postSchema);