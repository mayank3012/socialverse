const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key');



module.exports=(req,res,next)=>{
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer","");
    if(token!="null"){
        console.log("problem is in first if")
        return (res.status(401).json({error:"You Must Be Logged Out"}));
    }
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(!err){
            console.log("problem is in err")
            return (res.status(401).json({error:"You Must  Logged Out"}));
        }
        next();
    })
}
