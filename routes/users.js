const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const mongoose = require('mongoose');
const postModel = mongoose.model('post');
const userModel = mongoose.model('user');

router.get('/serchUser/:id',requireLogin,(req,res,next)=>{
    userModel.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        postModel.find({postBy:req.params.id})
        .select("-password")
        .populate("postBy","name _id photo")
        .exec((error,posts)=>{
            if(error){
                return res.status(422).json({error:error})        
            }
            else{
                res.json({user,posts})
            }
        })
    })
    .catch(err=>{
        res.status(404).json({error:"User Not Found"})
    })
})

router.put('/followUser',requireLogin,(req,res,next)=>{
    userModel.findByIdAndUpdate(req.body.followId,{
        $push:{follower:req.user._id}
    },{
        new:true
    },
    ((err,result)=>{
        if(err)
            return(res.status(422).json({error:err}))
        userModel.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{new:true})
            .then(resl=>{
                res.json({result:result,resl:resl});
            }).catch(err=>{
                console.log(err)
            })
    })
    )
})


router.put('/unfollowUser',requireLogin,(req,res,next)=>{
    userModel.findByIdAndUpdate(req.body.followId,{
        $pull:{follower:req.user._id}
    },{
        new:true
    },
    ((err,result)=>{
        if(err)
            return(res.status(422).json({error:err}))
        userModel.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.followId}
            },{new:true})
            .then(resl=>{
                res.json({result:result,resl:resl});
            }).catch(err=>{
                console.log(err)
            })
    })
    )
})


module.exports = router