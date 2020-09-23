const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireLogout = require('../middleware/requireLogout');
const { JWT_SECRET } = require('../config/key');
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const userModel = mongoose.model('user');

router.post('/Signup', (req, res, next) => {
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return (res.status(422).json({ error: "Kindly Fill All The Fields" }));
    }
    userModel.findOne({ $or: [{ email: email }, { userName: userName }] }).then(saveData => {
        if (saveData) {
            if (saveData.email == email)
                return (res.status(422).json({ error: "Email Already Registered" }));
            else
                return (res.status(422).json({ error: "User Name Already Taken" }));
        }
        bcrypt.hash(password, 12).then(hashedPassword => {
            const userDetails = new userModel({
                name,
                userName,
                email,
                password: hashedPassword
            })
            userDetails.save().then(user => {
                res.json({ messege: "Signup Successfully" })
            }).catch(err => {
                console.log(err);
            })
        })
    }).catch(err => {
        console.log(err);
    })
})
router.get('/Signup', (req, res, next) => {
    return (res.status(422).json({ Messege: "Successfully" }));
})
router.post('/Logout', (req, res, next) => {
    return (res.status(422).json({ Messege: "LoggedOut First" }));
})


router.get('/Signin', requireLogout, (req, res, next) => {
    return
})
router.post('/Signin', (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return (res.status(422).json({ error: "Kindly Fill All The Fields" }));
    }
    userModel.findOne({ $or: [{ email: userName }, { userName: userName }] })
        .then(saveData => {
            if (!saveData) {
                return (res.json({ error: "Invalid User Id/Password" }));
            }
            bcrypt.compare(password, saveData.password).then(doMatch => {
                if (doMatch) {
                    //res.json({messege:"SignIn Successfully"})
                    const token = jwt.sign({ _id: saveData._id }, JWT_SECRET);
                    const { _id, name, userName, photo,about,follower,following } = saveData
                    res.json({ token, user: { _id, name, userName,about,photo,follower,following } });
                }
                else
                    res.json({ error: "Invalid User Id/Password" })
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
})
router.post('/edituser', requireLogin, (req, res, next) => {
    const { name, about, photo } = req.body;
    const userDetails = userModel.findByIdAndUpdate(req.user._id, {
        name,
        about,
        photo
    })
    userDetails.exec(function (err) {
        if (err) {
            console.log(err);
            res.json({ error: "Invalid User Id/Password" });
        }
        else {
            res.json({ messege: "Record Updated" });
        }
    })
})
module.exports = router;