const mongoose =require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    about:{
    type:String,
    default:""
    }
    ,
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    photo:{
        type:String,
        default:"no image"
    }
    ,
    password:{
        type:String,
        require:true
    },
    follower:[{type:ObjectId,ref:"user"}],
    following:[{type:ObjectId,ref:"user"}],
    date:{
        type:Date,
        default:Date.now 
    }
})

mongoose.model('user',userSchema);