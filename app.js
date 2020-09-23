const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/key');
mongoose.connect(MONGOURI,
    { useUnifiedTopology: true, useNewUrlParser: true,useFindAndModify:false  })
const PORT=process.env.PORT || 5000;
app.use(express.json());
require('./models/user');
require('./models/post');
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/users'));
app.get('/',(req,res,next)=>{
    res.send("HELLO WORLD");
})

if(process.env.NODE_ENV==="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build",'index.html'))
    })
}
app.listen(PORT,()=>{
    console.log("Server started Successfully");
});
