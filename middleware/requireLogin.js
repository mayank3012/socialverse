const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');

module.exports=(req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization)
        return (res.status(401).json({error:"You Must Be Logged In"}));
    const token = authorization.replace("Bearer","");
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err)
            return (res.status(401).json({error:"You Must  Logged In"}));
        const {_id} = payload;
        userModel.findById(_id).then(userdata=>{
            req.user = userdata
            next();
        })
    })
}