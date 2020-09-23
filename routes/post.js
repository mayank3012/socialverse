const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const mongoose = require('mongoose');
const postModel = mongoose.model('post');

router.get("/Createpost",requireLogin,(req,res,next)=>{
    res.json({messege:""})
})
router.post("/Createpost",requireLogin,(req,res,next)=>{
    const {title,body,photo} = req.body;
    if(!title || !photo){
        return (res.status(402).json({error:"fill all the fields"}));
    }
    req.user.password=undefined;
    req.user.__v=undefined;
    const post = new postModel({
        title,
        body,
        photo,
        postBy:req.user
    })
    post.save().then(savedata=>{
        res.json({messege:"Posted"})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/Home',requireLogin,(req,res,next)=>{
    postModel.find({$or:[{postBy:{$in:req.user.following}},{postBy:req.user._id}]}).sort([['date', -1]])
    .populate('postBy',"_id name photo")
    .populate("comments.postedBy","_id name photo")
    .then(results=>{
        res.json({results:results})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/Profile',requireLogin,(req,res,next)=>{
    postModel.find({postBy:req.user._id}).sort([['date', -1]])
    .populate("postBy","_id name photo")
    .then(results=>{
        res.json({results:results})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put('/like',requireLogin,(req,res,next)=>{
    postModel.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postBy","_id name photo")
    .exec((err,result)=>{
        if(err)
            res.status(422).json({err:err});
        else{
            res.json({result:result})
        }
    })
})
router.put('/unlike',requireLogin,(req,res,next)=>{
    postModel.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postBy","_id name photo")
    .exec((err,result)=>{
        if(err)
            res.status(422).json({err:err});
        else{
            res.json({result:result})
        }
    })
})

router.put('/comment',requireLogin,(req,res,next)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    postModel.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate('postBy',"_id name photo")
    .populate("comments.postedBy","_id name photo")
    .exec((err,result)=>{
        if(err)
            res.status(422).json({err:err});
        else{
            res.json({result:result})
        }
    })
})
router.put('/delComment',requireLogin,(req,res,next)=>{
    const comment={
        text:req.body.text,
        postedBy:req.body.postedById
    }
    postModel.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:comment}
    },{
        new:true
    })
    .populate('postBy',"_id name photo")
    .populate("comments.postedBy","_id name photo")
    .exec((err,result)=>{
        if(err)
            res.status(422).json({err:err});
        else{
            res.json({result:result})
        }
    })
})

router.delete('/delete/:postId',requireLogin,(req,res,next)=>{
    postModel.findOne({_id:req.params.postId})
    .populate("postBy","_id name")
    .exec((err,post)=>{
        if(err||!post)
            return (res.status(422).json({error:err}))
        else{
            post.remove()
            .then(result=>{
                res.json({messege:"Deleted Successfuly"})
            }).catch(er=>{
                console.log(er);
            })
        }
    })
})
router.get('/viewComments/:postId',requireLogin,(req,res,next)=>{
    postModel.find({_id:req.params.postId})
    .populate("postBy","_id name photo")
    .populate("comments.postedBy","_id name photo")
    .then(results=>{
        res.json({results:results})
    })
    .catch(err=>{
        console.log(err);
    })
})

module.exports = router